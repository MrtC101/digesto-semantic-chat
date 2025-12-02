import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SideBarItem from "@/components/chat/ChatSidebar/sidebar_items";
import { Scale } from "lucide-react";

function SideBar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4 flex-shrink-0">
        <header className="border-b p-4" style={{ background: "var(--card)" }}>
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-card-foreground" />
            <h1 className="text-2xl font-bold text-card-foreground">
              Normita IA
            </h1>
          </div>
        </header>
        <h2 className="font-semibold text-lg">Chats</h2>
        <p className="text-sm text-muted-foreground">
          Historial de conversaciones
        </p>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SideBarItem />
      </SidebarContent>
    </Sidebar>
  );
}

export default SideBar;
