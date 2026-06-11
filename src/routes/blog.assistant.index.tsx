import { createFileRoute } from "@tanstack/react-router";
import { Bot, Shield, Code2, Smartphone } from "lucide-react";

export const Route = createFileRoute("/blog/assistant/")({
  component: AssistantIndex,
});

function AssistantIndex() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-10 gap-6">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.62_0.2_255)] to-[oklch(0.82_0.16_210)] shadow-glow">
        <Bot className="h-8 w-8 text-white" />
      </div>
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold mb-2">Assistant IA — Tech & Cyber</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Démarrez une nouvelle conversation pour échanger en temps réel avec notre IA experte.
        </p>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 max-w-2xl w-full">
        {[
          { icon: Shield, label: "Cybersécurité", color: "text-[oklch(0.82_0.16_210)]" },
          { icon: Code2, label: "Développement Web", color: "text-[oklch(0.62_0.2_255)]" },
          { icon: Smartphone, label: "Mobile", color: "text-[oklch(0.72_0.18_180)]" },
        ].map((x) => (
          <div key={x.label} className="rounded-xl border border-border/60 bg-background/50 p-4 flex flex-col items-center gap-2">
            <x.icon className={`h-6 w-6 ${x.color}`} />
            <span className="text-sm font-medium">{x.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
