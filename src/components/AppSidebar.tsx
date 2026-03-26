import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, BookOpen, DoorOpen, GraduationCap, BarChart3, Zap, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

// Updated paths to match the new App.tsx routes
const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/timetable', icon: Calendar, label: 'Timetable' },
  { to: '/faculty', icon: Users, label: 'Faculty' },
  { to: '/subjects', icon: BookOpen, label: 'Subjects' },
  { to: '/rooms', icon: DoorOpen, label: 'Rooms' },
  { to: '/classes', icon: GraduationCap, label: 'Classes' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate back to the login page (root)
    navigate('/');
    toast.info("Logged out successfully");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 gradient-hero flex flex-col border-r border-sidebar-border print:hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-accent">
          <Zap className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-sidebar-primary-foreground">SmartTT</h1>
          <p className="text-xs text-sidebar-foreground/60">SVPCET Generator</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className={cn('h-4.5 w-4.5', isActive && 'text-sidebar-primary')} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-sidebar-border p-4 space-y-2">
        {/* User Info Card */}
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/30 px-3 py-2.5 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-accent text-xs font-bold text-accent-foreground">
            A
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Admin</p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate uppercase tracking-wider">Dept. Coordinator</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
        >
          <LogOut className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
}