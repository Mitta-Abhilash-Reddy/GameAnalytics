import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gp-bg">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(124,106,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(124,106,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <Sidebar />

      <main className="ml-64 flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
