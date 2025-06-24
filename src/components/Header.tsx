import { Scale } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-card p-4 bg-background">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-white" />
            <h1 className="text-2xl font-bold text-white">Normita IA</h1>
          </div>
          <div className="text-sm text-muted-foreground"></div>
        </div>
      </div>
    </header>
  );
}
