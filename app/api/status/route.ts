import { NextResponse } from "next/server";
import { getLatestUpdate } from "@/lib/mysql";

/**
 * Com Cache Components, os GET Route Handlers são dinâmicos por padrão quando
 * acessam dados não-cacheados (consulta ao banco) — rodam em tempo de
 * requisição, nunca pré-renderizados na build.
 * Chamado apenas quando a página abre / dá refresh — nunca em polling.
 */
export async function GET() {
  const result = await getLatestUpdate();

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-store, max-age=0, must-revalidate",
    },
  });
}
