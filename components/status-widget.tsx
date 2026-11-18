"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusData = {
  success: boolean;
  updatedAt: string | null;
};

type Phase =
  | { state: "loading" }
  | { state: "ok"; iso: string }
  | { state: "stale"; iso: string }
  | { state: "empty" }
  | { state: "error" };

function parseTimeAgo(target: number, now: number) {
  const diff = Math.max(0, now - target);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "menos de 1 minuto";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} d`;
}

/** Fuso fixo do Brasil (SP) — a exibição nunca depende do fuso do PC. */
const BR_TIME_ZONE = "America/Sao_Paulo";

/** Exibe a data e hora sempre no horário do Brasil, não no do navegador. */
function formatFull(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: BR_TIME_ZONE,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Atualização "no dia": até 24h de idade o sistema é considerado ativo. */
const STALE_AFTER_MS = 24 * 60 * 60 * 1000; // 24h

export function StatusWidget() {
  const [phase, setPhase] = useState<Phase>({ state: "loading" });
  const [now, setNow] = useState(() => Date.now());
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as StatusData;

      if (!data.success) {
        setPhase({ state: "error" });
        return;
      }
      if (!data.updatedAt) {
        setPhase({ state: "empty" });
        return;
      }
      const ts = new Date(data.updatedAt).getTime();
      // A diferença é entre instantes absolutos (época UTC), logo é a mesma
      // em qualquer fuso — não depende do relógio/fuso do PC do usuário.
      const diff = Date.now() - ts;
      // "No dia" = até 24h de idade → ativo. Mais de 24h → atualização antiga.
      if (diff <= STALE_AFTER_MS) setPhase({ state: "ok", iso: data.updatedAt });
      else setPhase({ state: "stale", iso: data.updatedAt });
    } catch {
      setPhase({ state: "error" });
    } finally {
      setRefreshing(false);
      setNow(Date.now());
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          <Activity className="h-4 w-4" aria-hidden />
          Última atualização
        </div>
        <button
          type="button"
          onClick={() => void fetchStatus()}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-neutral-500 transition-colors hover:bg-white hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <RefreshCw
            className={cn("h-4 w-4", refreshing && "animate-spin")}
            aria-hidden
          />
          Atualizar
        </button>
      </div>

      {phase.state === "loading" ? (
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 animate-pulse rounded-full bg-neutral-300" />
          <span className="text-base text-neutral-500">
            Verificando o sistema…
          </span>
        </div>
      ) : null}

      {phase.state === "ok" ? (
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          <div className="text-base">
            <span className="font-semibold text-emerald-700">Sistema ativo</span>
            <span className="ml-1.5 text-neutral-500">
              · atualizado {parseTimeAgo(new Date(phase.iso).getTime(), now)} atrás
            </span>
          </div>
        </div>
      ) : null}

      {phase.state === "stale" ? (
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <div className="text-base">
            <span className="font-semibold text-amber-700">Atualização antiga</span>
            <span className="ml-1.5 text-neutral-500">
              · última há {parseTimeAgo(new Date(phase.iso).getTime(), now)} atrás
            </span>
          </div>
        </div>
      ) : null}

      {phase.state === "empty" ? (
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-full bg-neutral-300" />
          <span className="text-base text-neutral-500">
            Ainda sem atualização registrada
          </span>
        </div>
      ) : null}

      {phase.state === "error" ? (
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-full bg-neutral-400" />
          <span className="text-base text-neutral-500">
            Status indisponível no momento
          </span>
        </div>
      ) : null}

      {(phase.state === "ok" || phase.state === "stale") && phase.iso ? (
        <p className="text-sm text-neutral-400">
          Última atualização registrada: {formatFull(phase.iso)}
        </p>
      ) : null}
    </div>
  );
}
