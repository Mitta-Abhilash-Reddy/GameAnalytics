const request = require('supertest');
const app = require('../src/app');

// Helper: register a user and get token
const getAuthToken = async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      username: `player_${Date.now()}`,
      email: `player_${Date.now()}@gamepulse.ai`,
      password: 'Test1234!',
    });
  return res.body.data?.token;
};

// Helper: build a valid event payload
const buildEvent = (overrides = {}) => ({
  eventType: 'match_start',
  sessionId: `session_${Date.now()}`,
  game: 'Valorant',
  clientTimestamp: new Date().toISOString(),
  properties: { map: 'Ascent', mode: 'ranked' },
  device: { platform: 'pc', os: 'Windows 11' },
  ...overrides,
});

describe('Events API', () => {
  let token;
  let sessionId;

  beforeAll(async () => {
    token = await getAuthToken();
    sessionId = `session_test_${Date.now()}`;
  });

  // ── POST /api/events ────────────────────────────────────────
  describe('POST /api/events', () => {
    it('should ingest a single event and return 201', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send(buildEvent({ sessionId }))
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.eventId).toBeDefined();
      expect(res.body.data.eventType).toBe('match_start');
    });

    it('should create a session on session_start event', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send(buildEvent({
          eventType: 'session_start',
          sessionId: `sess_start_${Date.now()}`,
        }))
        .expect(201);

      expect(res.body.success).toBe(true);
    });

    it('should reject event without required fields', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send({ eventType: 'kill' }) // missing sessionId, game, clientTimestamp
        .expect(422);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should reject invalid eventType', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send(buildEvent({ eventType: 'invalid_event_xyz' }))
        .expect(422);

      expect(res.body.success).toBe(false);
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/events')
        .send(buildEvent())
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should reject invalid clientTimestamp', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send(buildEvent({ clientTimestamp: 'not-a-date' }))
        .expect(422);

      expect(res.body.success).toBe(false);
    });
  });

  // ── POST /api/events/batch ──────────────────────────────────
  describe('POST /api/events/batch', () => {
    it('should ingest a batch of events', async () => {
      const batchSessionId = `batch_sess_${Date.now()}`;
      const events = [
        buildEvent({ eventType: 'session_start', sessionId: batchSessionId }),
        buildEvent({ eventType: 'match_start', sessionId: batchSessionId }),
        buildEvent({ eventType: 'kill', sessionId: batchSessionId }),
        buildEvent({ eventType: 'death', sessionId: batchSessionId }),
        buildEvent({ eventType: 'match_end', sessionId: batchSessionId }),
        buildEvent({ eventType: 'session_end', sessionId: batchSessionId }),
      ];

      const res = await request(app)
        .post('/api/events/batch')
        .set('Authorization', `Bearer ${token}`)
        .send({ events })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.inserted).toBe(6);
    });

    it('should reject batch with more than 100 events', async () => {
      const events = Array.from({ length: 101 }, () => buildEvent());

      const res = await request(app)
        .post('/api/events/batch')
        .set('Authorization', `Bearer ${token}`)
        .send({ events })
        .expect(422);

      expect(res.body.success).toBe(false);
    });

    it('should reject empty batch', async () => {
      const res = await request(app)
        .post('/api/events/batch')
        .set('Authorization', `Bearer ${token}`)
        .send({ events: [] })
        .expect(422);

      expect(res.body.success).toBe(false);
    });

    it('should return 401 without auth', async () => {
      const res = await request(app)
        .post('/api/events/batch')
        .send({ events: [buildEvent()] })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  // ── GET /api/events ─────────────────────────────────────────
  describe('GET /api/events', () => {
    beforeAll(async () => {
      // Seed some events for querying
      const events = [
        buildEvent({ eventType: 'kill', game: 'Valorant', sessionId }),
        buildEvent({ eventType: 'death', game: 'Valorant', sessionId }),
        buildEvent({ eventType: 'match_end', game: 'CS2', sessionId }),
      ];
      await request(app)
        .post('/api/events/batch')
        .set('Authorization', `Bearer ${token}`)
        .send({ events });
    });

    it('should return paginated events', async () => {
      const res = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 5 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.events)).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(5);
    });

    it('should filter by eventType', async () => {
      const res = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .query({ eventType: 'kill' })
        .expect(200);

      expect(res.body.success).toBe(true);
      res.body.data.events.forEach((e) => {
        expect(e.eventType).toBe('kill');
      });
    });

    it('should filter by game', async () => {
      const res = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .query({ game: 'CS2' })
        .expect(200);

      expect(res.body.success).toBe(true);
      res.body.data.events.forEach((e) => {
        expect(e.game).toMatch(/CS2/i);
      });
    });

    it('should return 401 without auth', async () => {
      await request(app).get('/api/events').expect(401);
    });
  });

  // ── GET /api/events/stats ───────────────────────────────────
  describe('GET /api/events/stats', () => {
    it('should return event statistics', async () => {
      const res = await request(app)
        .get('/api/events/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.summary).toBeDefined();
      expect(res.body.data.summary.totalEvents).toBeGreaterThan(0);
      expect(Array.isArray(res.body.data.byEventType)).toBe(true);
      expect(Array.isArray(res.body.data.byGame)).toBe(true);
      expect(Array.isArray(res.body.data.dailyActivity)).toBe(true);
    });

    it('should return 401 without auth', async () => {
      await request(app).get('/api/events/stats').expect(401);
    });
  });
});
