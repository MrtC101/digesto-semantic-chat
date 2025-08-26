import { Scale } from "lucide-react";

function PageHeader() {
  return (
    <header className="border-b p-4" style={{ background: "var(--card)" }}>
      <div className="flex items-center gap-2">
        <Scale className="h-6 w-6 text-card-foreground" />
        <h1 className="text-2xl font-bold text-card-foreground">Normita IA</h1>
      </div>
    </header>
  );
}

export default PageHeader;
