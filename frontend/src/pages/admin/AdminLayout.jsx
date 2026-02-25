import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  FiGrid, FiList, FiCalendar, FiImage, FiSettings, FiCreditCard, FiMessageSquare,
  FiLogOut, FiMenu, FiX, FiChevronRight
} from 'react-icons/fi';

const navItems = [
  { to: '/admin',                  label: 'Dashboard',       icon: FiGrid,          exact: true },
  { to: '/admin/services',         label: 'Services',        icon: FiList },
  { to: '/admin/bookings',         label: 'Bookings',        icon: FiCalendar },
  { to: '/admin/messages',         label: 'Messages',        icon: FiMessageSquare },
  { to: '/admin/gallery',          label: 'Gallery',         icon: FiImage },
  { to: '/admin/payment-settings', label: 'Payment Methods', icon: FiCreditCard },
  { to: '/admin/site-content',     label: 'Site Content',    icon: FiSettings },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Poll for unread messages every 30 seconds
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/contact', { params: { status: 'unread' } });
        setUnreadCount(data.messages?.length || 0);
      } catch { /* silent */ }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]); // re-fetch when navigating

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-charcoal flex flex-col transition-all duration-300 min-h-screen fixed top-0 left-0 z-40`}>
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          {sidebarOpen && (
            <span className="text-white font-serif font-semibold text-lg">
              Glow <span className="text-gold">&</span> Glam
            </span>
          )}
          <button onClick={() => setSidebarOpen(p => !p)} className="text-gray-400 hover:text-white ml-auto">
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gold rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-white text-sm font-medium">{user?.name}</div>
                <div className="text-gray-400 text-xs">Administrator</div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-gold text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <div className="relative flex-shrink-0">
                  <Icon size={18} />
                  {item.to === '/admin/messages' && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                {sidebarOpen && <span className="flex-1">{item.label}</span>}
                {sidebarOpen && item.to === '/admin/messages' && unreadCount > 0 && !active && (
                  <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-auto">
                    {unreadCount}
                  </span>
                )}
                {sidebarOpen && active && <FiChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl text-sm transition-all ${!sidebarOpen ? 'justify-center' : ''}`}
            title="Logout"
          >
            <FiLogOut size={18} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
