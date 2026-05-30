// mongo-init.js
// Runs when the MongoDB Docker container is first created.
// Creates the gamepulse database and a dedicated app user.

db = db.getSiblingDB('gamepulse');

db.createUser({
  user: 'gamepulse_user',
  pwd: 'gamepulse_password',
  roles: [{ role: 'readWrite', db: 'gamepulse' }],
});

// Create initial collections with validation
db.createCollection('users');
db.createCollection('events');

print('✅ GamePulse MongoDB initialized successfully.');
