import "server-only";
import mysql from "mysql2/promise";

/**
 * Conexão com o MySQL do Carste Seismography (somente leitura).
 * As credenciais ficam apenas no servidor, via variáveis de ambiente.
 */
export async function getConnection() {
  return mysql.createConnection({
    host: process.env.MYSQL_HOST ?? "mysql-139299-0.cloudclusters.net",
    port: Number(process.env.MYSQL_PORT ?? "19567"),
    database: process.env.MYSQL_DATABASE ?? "carste",
    user: process.env.MYSQL_USER ?? "diretorios",
    password: process.env.MYSQL_PASSWORD ?? "D1r3T0rios",
    ssl: process.env.MYSQL_SSL === "true" ? {} : undefined,
    connectTimeout: 8000,
    rowsAsArray: false,
  });
}

/** Fuso fixo do Brasil (SP). */
const BR_TIME_ZONE = "America/Sao_Paulo";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Converte uma "hora de parede" (ex.: 14:30 do dia 18/11/2026, horário do
 * Brasil) no instante UTC absoluto correspondente — sem depender do fuso de
 * quem executa (servidor ou navegador).
 */
function wallTimeInBrazilToEpoch(
  y: number,
  mo: number,
  d: number,
  hh: number,
  mi: number,
  ss: number
): number {
  const targetWall = Date.UTC(y, mo - 1, d, hh, mi, ss);
  let guess = targetWall; // chute inicial: offset 0 (2–3 iterações convergem)
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: BR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  for (let i = 0; i < 3; i++) {
    const parts = Object.fromEntries(
      fmt.formatToParts(new Date(guess)).map((p) => [p.type, p.value])
    );
    const wallMs = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second)
    );
    guess += targetWall - wallMs;
  }
  return guess;
}

/**
 * Converte o varchar `updatedAt` para ISO (UTC).
 * - Se o valor já trouxer fuso explícito (Z ou ±hh:mm), respeita o offset.
 * - Caso contrário, interpreta SEMPRE como horário do Brasil (America/Sao_Paulo),
 *   independentemente do fuso do servidor.
 */
function toDate(value: string): string {
  const normalized = value.trim();
  if (!normalized) return "";

  // Já possui fuso explícito → interpretar como instante absoluto.
  if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized)) {
    const parsed = new Date(normalized);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }

  // Data/hora sem fuso → tratar como horário do Brasil.
  const match = normalized.match(
    /^(\d{1,4})[-/.](\d{1,2})[-/.](\d{1,4})(?:[T\s]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/
  );
  if (match) {
    let y: number, mo: number, d: number;
    if (match[1].length === 4) {
      // formato AAAA-MM-DD
      y = Number(match[1]);
      mo = Number(match[2]);
      d = Number(match[3]);
    } else if (match[3].length === 4) {
      // formato DD/MM/AAAA (padrão brasileiro)
      d = Number(match[1]);
      mo = Number(match[2]);
      y = Number(match[3]);
    } else {
      return "";
    }
    const hh = Number(match[4] ?? 0);
    const mi = Number(match[5] ?? 0);
    const ss = Number(match[6] ?? 0);
    if (
      y >= 2000 &&
      y <= 2100 &&
      mo >= 1 &&
      mo <= 12 &&
      d >= 1 &&
      d <= 31
    ) {
      const epoch = wallTimeInBrazilToEpoch(y, mo, d, hh, mi, ss);
      return new Date(epoch).toISOString();
    }
  }

  // Último recurso: tentativa genérica.
  const parsed = new Date(normalized);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  return "";
}

export async function getLatestUpdate(): Promise<{ success: boolean; updatedAt: string | null; error?: string }> {
  let connection: mysql.Connection | null = null;
  try {
    connection = await getConnection();
    const [rows] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT MAX(updatedAt) AS updatedAt FROM diretorios"
    );
    const raw = rows?.[0]?.updatedAt as string | null | undefined;
    return {
      success: true,
      updatedAt: raw ? toDate(String(raw)) : null,
    };
  } catch (error) {
    console.error("Erro ao consultar MySQL (diretorios.updatedAt):", error);
    return { success: false, updatedAt: null, error: errorMessage(error) };
  } finally {
    if (connection) await connection.end().catch(() => undefined);
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return String(error);
}
