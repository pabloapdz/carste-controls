"use client";

import { useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";
import type { Access } from "@/lib/projects";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Cor da badge conforme o tipo de acesso (diferenciar geral, admin etc.). */
function badgeVariantFor(label: string): BadgeProps["variant"] {
  const l = label.toLowerCase();
  if (l.includes("admin")) return "warning";
  if (l.includes("geral")) return "success";
  if (l.includes("relatori")) return "info";
  if (l.includes("empresa")) return "default";
  return "neutral";
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-sm font-semibold text-neutral-500">{label}</p>
      <button
        type="button"
        onClick={() => void copy()}
        title={`Copiar ${label}`}
        aria-label={`Copiar ${label}`}
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left shadow-sm transition-all",
          copied
            ? "border-emerald-300 bg-emerald-50"
            : "border-neutral-200 bg-neutral-50 hover:border-brand-300 hover:bg-white"
        )}
      >
        <span className="min-w-0 truncate font-mono text-base font-medium tracking-tight text-neutral-800">
          {value}
        </span>
        <span
          aria-hidden
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition-colors group-hover:bg-brand-50",
            copied
              ? "text-emerald-600"
              : "text-neutral-400 group-hover:text-brand-600"
          )}
        >
          {copied ? (
            <Check className="h-4 w-4" strokeWidth={2.5} />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </span>
      </button>
    </div>
  );
}

export function AccessDialog({
  open,
  onOpenChange,
  projectName,
  accesses,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  accesses: Access[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-brand-600" aria-hidden />
            Credenciais de acesso
          </DialogTitle>
          <DialogDescription>
            Acessos de leitura para entrar no {projectName}. Clique em um campo
            para copiar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[55dvh] flex-col gap-3 overflow-y-auto pr-1">
          {accesses.map((access) => (
            <div
              key={`${access.user}-${access.login}`}
              className="rounded-2xl border border-neutral-200/80 bg-white p-4"
            >
              <div className="mb-3 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-lg font-semibold text-neutral-900">
                  {access.user}
                </p>
                <Badge
                  variant={badgeVariantFor(access.label)}
                  className="self-start capitalize"
                >
                  {access.label}
                </Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <CopyField label="Usuário" value={access.login ?? ""} />
                <CopyField label="Senha" value={access.password ?? ""} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t border-neutral-100 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
