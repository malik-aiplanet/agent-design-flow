
import { Bot, Settings, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Agents", url: "/", icon: Bot },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white">
      <SidebarHeader className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
            <Sparkles className="h-5 w-5 text-blue-600" />
          </div>
          {state !== "collapsed" && (
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                AI Agents
              </h2>
              <p className="text-xs text-slate-600 font-medium">Intelligent automation platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-14 rounded-lg">
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-4 rounded-lg transition-all duration-200 relative ${
                          isActive 
                            ? "bg-blue-600 text-white border-l-4 border-blue-800 shadow-sm" 
                            : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-600'} transition-colors duration-200`} />
                          {state !== "collapsed" && (
                            <span className={`font-semibold text-base ${isActive ? 'text-white' : 'text-slate-700'} transition-colors duration-200`}>
                              {item.title}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
