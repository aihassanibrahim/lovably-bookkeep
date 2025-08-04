import { 
  Home, 
  Users, 
  Receipt, 
  CreditCard, 
  Building2, 
  TrendingUp,
  Settings,
  BookOpen,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  { title: "Översikt", url: "/", icon: Home },
  { title: "Kontoplan", url: "/accounts", icon: BookOpen },
  { title: "Transaktioner", url: "/transactions", icon: Receipt },
  { title: "Kunder", url: "/customers", icon: Users },
  { title: "Leverantörer", url: "/suppliers", icon: Building2 },
  { title: "Rapporter", url: "/reports", icon: TrendingUp },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { signOut, user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50";

  return (
    <Sidebar collapsible="icon">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          {state !== "collapsed" && <span className="font-semibold text-lg">Bokföring</span>}
        </div>
      </div>
      
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2">
          {state !== "collapsed" && (
            <p className="text-xs text-muted-foreground mb-2">
              Inloggad som: {user?.email}
            </p>
          )}
          <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            {state !== "collapsed" && <span>Logga ut</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}