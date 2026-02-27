import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import AdminLogin from './AdminLogin'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  MessageSquare,
  FolderKanban,
  BrainCircuit,
  Award,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard',       end: true },
  { to: '/admin/messages',   icon: MessageSquare,   label: 'Messages'                    },
  { to: '/admin/projects',   icon: FolderKanban,    label: 'Projects'                    },
  { to: '/admin/skills',     icon: BrainCircuit,    label: 'Skills'                      },
  { to: '/admin/certs',      icon: Award,           label: 'Certifications'              },
  { to: '/admin/about',      icon: User,            label: 'About Me'                    },
]

export default function AdminLayout() {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    navigate('/admin')
  }

  // Loading state
  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // Not authenticated
  if (!session) return <AdminLogin onLogin={() => {}} />

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden w-60 shrink-0 border-r bg-card lg:block">
        <div className="sticky top-0 flex h-screen flex-col gap-1 p-4">
          <h2 className="mb-2 px-3 text-lg font-bold tracking-tight">Admin Panel</h2>
          <Separator className="mb-2" />

          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Separator className="my-2" />
          <Button variant="ghost" size="sm" className="justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden">
          <h2 className="text-lg font-bold">Admin</h2>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-60 border-r bg-card p-4 shadow-lg">
              <h2 className="mb-3 px-3 text-lg font-bold">Admin Panel</h2>
              <Separator className="mb-3" />
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={linkClass}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <Separator className="my-3" />
              <Button variant="ghost" size="sm" className="justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Log Out
              </Button>
            </aside>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
