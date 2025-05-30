
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
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-slate-50">
      <SidebarHeader className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
            <Sparkles className="h-5 w-5 text-blue-700" />
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
      
      <SidebarContent className="bg-slate-50 p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 rounded-lg">
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 relative ${
                          isActive 
                            ? "bg-blue-100 text-blue-800 border-l-4 border-blue-500" 
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-slate-600'} transition-colors duration-200`} />
                          {state !== "collapsed" && (
                            <span className={`font-medium ${isActive ? 'text-blue-800' : 'text-slate-700'} transition-colors duration-200`}>
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
