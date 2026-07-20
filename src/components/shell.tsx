import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import {
  LayoutDashboard,
  ClipboardList,
  UserPlus,
  MapPin,
  CheckCircle,
  CheckSquare,
  XCircle,
  Users,
  MessageSquare,
  Bell,
  FileBarChart,
  PieChart,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Wifi,
  WifiOff,
  ChevronsLeft,
  ChevronsRight,
  User,
  FileText,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useProfile, useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../hooks/use-data';
import { useAuth } from '../hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import logo from '@/assets/logo.png';

const NAV_ITEMS = [
  { group: 'Main', items: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Assigned Tasks', icon: ClipboardList, path: '/tasks' },
  ]},
  { group: 'Actions', items: [
    { label: 'Register Vendor', icon: UserPlus, path: '/register-vendor' },
    { label: 'Map Shop', icon: MapPin, path: '/map-shop' },
  ]},
  { group: 'Review', items: [
    { label: 'Vendor Verification', icon: CheckSquare, path: '/verification' },
    { label: 'Completed Tasks', icon: CheckCircle, path: '/tasks/completed' },
    { label: 'Rejected Submissions', icon: XCircle, path: '/tasks/rejected' },
  ]},
  { group: 'Explore', items: [
    { label: 'Nearby Vendors', icon: Users, path: '/nearby-vendors' },
  ]},
  { group: 'Communications', items: [
    { label: 'Messages', icon: MessageSquare, path: '/messages' },
    { label: 'Notifications', icon: Bell, path: '/notifications' },
  ]},
  { group: 'Insights', items: [
    { label: 'Reports', icon: FileBarChart, path: '/reports' },
    { label: 'Analytics', icon: PieChart, path: '/analytics' },
  ]},
  { group: 'Account', items: [
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Help Center', icon: HelpCircle, path: '/help' },
  ]},
];

const SIDEBAR_COLLAPSED_KEY = 'mapper-portal:sidebar-collapsed';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'assignment': return <FileText className="h-4 w-4 text-blue-500" />;
    case 'approval': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case 'rejection': return <AlertCircle className="h-4 w-4 text-destructive" />;
    default: return <Settings className="h-4 w-4 text-muted-foreground" />;
  }
};

export function Shell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
    } catch {
      return false;
    }
  });

  const { logout } = useAuth();
  const { data: profile } = useProfile();
  const { data: notifications } = useNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const recentNotifications = notifications?.slice(0, 5) || [];

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0');
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const NavLinks = ({ onClick, collapsed = false }: { onClick?: () => void; collapsed?: boolean }) => (
    <div className="flex-1 overflow-y-auto py-4">
      {NAV_ITEMS.map((group, i) => (
        <div key={i} className="mb-5 px-3">
          {!collapsed && (
            <h3 className="mb-2 px-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
              {group.group}
            </h3>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = location === item.path || location.startsWith(item.path + '/');
              const linkButton = (
                <Link key={item.path} href={item.path}>
                  <button
                    onClick={onClick}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-200",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-[#173B7B] text-white shadow-md shadow-[#173B7B]/20"
                        : "text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#1F2937]"
                    )}
                    data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className={cn("h-[18px] w-[18px] flex-shrink-0", active ? "text-white" : "text-[#9CA3AF]")} />
                    {!collapsed && (
                      <>
                        {item.label}
                        {item.label === 'Notifications' && unreadCount > 0 && (
                          <span className="ml-auto bg-[#F36E09] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.path} delayDuration={200}>
                    <TooltipTrigger asChild>{linkButton}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-[#1F2937] text-white border-none">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return linkButton;
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const ProfileMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-3 cursor-pointer rounded-md px-1.5 py-1 hover:bg-[#F1F5F9] transition-colors"
          data-testid="button-profile-menu"
        >
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-[#1F2937] leading-none">{profile?.name || 'Loading...'}</p>
            <p className="text-xs text-[#9CA3AF]">{profile?.employeeId || 'ID'}</p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-[#173B7B]/20">
            <AvatarImage src={profile?.avatarUrl} />
            <AvatarFallback className="bg-[#173B7B] text-white font-heading font-bold text-xs">
              {profile?.name?.split(' ').map(n => n[0]).join('') || 'MM'}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-[14px] border-[#E5E7EB] shadow-xl" data-testid="menu-profile">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-semibold text-[#1F2937]">{profile?.name}</span>
            <span className="text-xs text-[#9CA3AF] font-normal">{profile?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#F1F5F9]" />
        <DropdownMenuItem asChild data-testid="menu-item-profile">
          <Link href="/profile" className="flex items-center gap-2 w-full cursor-pointer text-[#6B7280] hover:text-[#173B7B] focus:text-[#173B7B]">
            <User className="h-4 w-4" /> View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild data-testid="menu-item-settings">
          <Link href="/settings" className="flex items-center gap-2 w-full cursor-pointer text-[#6B7280] hover:text-[#173B7B] focus:text-[#173B7B]">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild data-testid="menu-item-help">
          <Link href="/help" className="flex items-center gap-2 w-full cursor-pointer text-[#6B7280] hover:text-[#173B7B] focus:text-[#173B7B]">
            <HelpCircle className="h-4 w-4" /> Help Center
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#F1F5F9]" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-[#EF4444] focus:text-[#EF4444] cursor-pointer"
          data-testid="menu-item-logout"
        >
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const NotificationMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-[#6B7280] hover:text-[#173B7B] hover:bg-[#F1F5F9] rounded-[10px]" data-testid="button-notification-menu">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#F36E09] ring-2 ring-white"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-[14px] border-[#E5E7EB] shadow-xl" data-testid="menu-notifications">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-[#1F2937]">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              className="text-xs font-medium text-[#173B7B] hover:text-[#044E75] flex items-center gap-1"
              data-testid="button-mark-all-read"
            >
              <Check className="h-3 w-3" /> Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-[#F1F5F9]" />
        {recentNotifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-[#9CA3AF]">You're all caught up.</div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                onClick={() => !notif.read && markAsRead.mutate(notif.id)}
                className={cn(
                  "flex items-start gap-2.5 py-2.5 cursor-pointer whitespace-normal",
                  !notif.read && "bg-[#F8FAFC]"
                )}
                data-testid={`notification-item-${notif.id}`}
              >
                <div className="mt-0.5 flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm leading-tight", !notif.read ? "font-semibold text-[#1F2937]" : "text-[#6B7280]")}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-[11px] text-[#9CA3AF]/70 mt-1">
                    {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                  </p>
                </div>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-[#F36E09] flex-shrink-0 mt-1.5" />}
              </DropdownMenuItem>
            ))}
          </div>
        )}
        <DropdownMenuSeparator className="bg-[#F1F5F9]" />
        <DropdownMenuItem asChild data-testid="menu-item-view-all-notifications">
          <Link href="/notifications" className="flex items-center justify-center w-full cursor-pointer text-[#173B7B] font-medium">
            View All Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-[#E5E7EB] h-full z-20 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-[260px]"
        )}
      >
        {/* Sidebar Header - White with subtle bottom border */}
        <div className="h-16 flex items-center px-5 border-b border-[#F1F5F9] justify-between">
          <div className={cn("flex items-center gap-2.5 font-heading font-bold text-[15px] tracking-tight overflow-hidden", isCollapsed && "gap-0 justify-center")}>
            <img src={logo} alt="Market Mirror" className="w-8 h-8 object-contain flex-shrink-0" />
            {!isCollapsed && <span className="text-[#1F2937]">Market Mirror</span>}
          </div>
        </div>

        <NavLinks collapsed={isCollapsed} />

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#F1F5F9] space-y-1">
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <button
                onClick={toggleCollapsed}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium text-[#9CA3AF] hover:bg-[#F1F5F9] hover:text-[#6B7280] transition-colors",
                  isCollapsed && "justify-center px-0"
                )}
                data-testid="button-toggle-sidebar"
              >
                {isCollapsed ? <ChevronsRight className="h-[18px] w-[18px]" /> : <ChevronsLeft className="h-[18px] w-[18px]" />}
                {!isCollapsed && 'Collapse'}
              </button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right" className="bg-[#1F2937] text-white border-none">Expand sidebar</TooltipContent>}
          </Tooltip>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium text-[#EF4444] hover:bg-red-50 transition-colors",
                  isCollapsed && "justify-center px-0"
                )}
                data-testid="button-logout"
              >
                <LogOut className="h-[18px] w-[18px]" />
                {!isCollapsed && 'Logout'}
              </button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right" className="bg-[#1F2937] text-white border-none">Logout</TooltipContent>}
          </Tooltip>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-[#E5E7EB] bg-white z-10">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-[#6B7280] hover:text-[#173B7B] hover:bg-[#F1F5F9] rounded-[10px]" data-testid="button-open-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-0 flex flex-col bg-white border-[#E5E7EB]">
                <div className="h-16 flex items-center px-5 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2.5 font-heading font-bold text-[15px] tracking-tight">
                    <img src={logo} alt="Market Mirror" className="w-8 h-8 object-contain" />
                    <span className="text-[#1F2937]">Market Mirror</span>
                  </div>
                </div>
                <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
                <div className="p-4 border-t border-[#F1F5F9]">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium text-[#EF4444] hover:bg-red-50 transition-colors"
                    data-testid="button-logout-mobile"
                  >
                    <LogOut className="h-[18px] w-[18px]" />
                    Logout
                  </button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex items-center bg-[#F8FAFC] px-3.5 py-2 rounded-[10px] text-sm text-[#9CA3AF] w-72 border border-[#E5E7EB] focus-within:border-[#173B7B] focus-within:ring-2 focus-within:ring-[#173B7B]/10 transition-all duration-200">
              <Search className="h-4 w-4 mr-2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none outline-none w-full text-[#1F2937] placeholder:text-[#9CA3AF] text-[13px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Sync Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F8FAFC] border border-[#E5E7EB]">
              {isOnline ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[#6B7280]">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-[#EF4444]" />
                  <span className="text-[#EF4444]">Offline</span>
                </>
              )}
            </div>

            {/* Chat Icon */}
            <Link href="/messages">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-[#6B7280] hover:text-[#173B7B] hover:bg-[#F1F5F9] rounded-[10px]"
                    data-testid="button-chat"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[#1F2937] text-white border-none text-xs">
                  Messages
                </TooltipContent>
              </Tooltip>
            </Link>

            <NotificationMenu />

            <div className="h-7 w-px bg-[#E5E7EB] hidden md:block"></div>

            <ProfileMenu />
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
