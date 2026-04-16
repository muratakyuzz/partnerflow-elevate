import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Handshake,
  FolderOpen,
  BarChart3,
  LogOut,
  ChevronDown,
  Bell,
  Zap,
  DollarSign,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const adminNav = [
  { title: "Dashboard", url: "/app/admin/dashboard", icon: LayoutDashboard },
  { title: "Partners", url: "/app/admin/partners", icon: Building2 },
  { title: "Users", url: "/app/admin/users", icon: Users },
  { title: "Leads", url: "/app/admin/leads", icon: Zap },
  { title: "Deals", url: "/app/admin/deals", icon: Handshake },
  { title: "Documents", url: "/app/admin/documents", icon: FolderOpen },
  { title: "Reporting", url: "/app/admin/reporting", icon: BarChart3 },
];

const adminConfigNav = [
  { title: "Configure", url: "/app/admin/configure", icon: Settings2 },
];

const partnerNav = [
  { title: "Dashboard", url: "/app/partner/dashboard", icon: LayoutDashboard },
  { title: "Leads", url: "/app/partner/leads", icon: Zap },
  { title: "Deals", url: "/app/partner/deals", icon: Handshake },
  { title: "Documents", url: "/app/partner/documents", icon: FolderOpen },
  { title: "Finance", url: "/app/partner/finance", icon: DollarSign },
];

function SidebarNav() {
  const { user, role } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const items = role === "admin" ? adminNav : partnerNav;

  return (
    <Sidebar collapsible="icon" className="border-r-0 shadow-elevated">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm shrink-0">
          P
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
            PartnerHub
          </span>
        )}
      </div>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-muted font-semibold px-3 mb-1">
              {role === "admin" ? "Administration" : "My Portal"}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-sidebar-accent/50">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-muted truncate">{user.email}</p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function Topbar() {
  const { user, logout, switchRole, role } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b glass-subtle flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground" />
      </div>

      <div className="flex items-center gap-2">
        {/* Role switcher for demo */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newRole = role === "admin" ? "partner" : "admin";
            switchRole(newRole);
            navigate(`/app/${newRole}/dashboard`);
          }}
          className="text-xs h-8"
        >
          Switch to {role === "admin" ? "Partner" : "Admin"}
        </Button>

        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 text-sm h-9 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {user?.name.split(" ").map((n) => n[0]).join("") || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline font-medium">{user?.name}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {user?.email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AppShell() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarNav />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-6 overflow-auto">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
