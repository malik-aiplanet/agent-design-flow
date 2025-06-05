import { Bot, Settings, Wrench, Cpu, StopCircle, Users, Workflow } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/auth/UserAvatar";

const items = [
  { title: "Workflow", url: "/", icon: Workflow },
  { title: "Agents", url: "/agents-2", icon: Users },
  { title: "Tools", url: "/tools", icon: Wrench },
  { title: "Models", url: "/models", icon: Cpu },
  { title: "Terminations", url: "/terminations", icon: StopCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="bg-white border-r border-gray-200">
      <SidebarHeader className="p-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          {state !== "collapsed" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                AI Agents
              </h2>
              <p className="text-xs text-gray-500">Management platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 h-10 rounded-md transition-colors relative ${
                        isActive
                          ? "bg-blue-600 text-white border-l-4 border-blue-800"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                        {state !== "collapsed" && (
                          <span className="font-medium text-sm">
                            {item.title}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white p-2">
        <SidebarSeparator className="mb-2" />
        {state !== "collapsed" && <UserAvatar />}
      </SidebarFooter>
    </Sidebar>
  );
}
