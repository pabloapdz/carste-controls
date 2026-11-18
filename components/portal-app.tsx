"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Loader2, LockKeyhole, LogOut, ShieldCheck } from "lucide-react";
import { PORTAL_CREDENTIALS, projects } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard, PlaceholderCard } from "@/components/project-card";

const AUTH_KEY = "carste-controls-auth";

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(false);
    setLoading(true);
    // Pequeno delay para feedback visual
    window.setTimeout(() => {
      if (
        username.trim().toLowerCase() === PORTAL_CREDENTIALS.username &&
        password === PORTAL_CREDENTIALS.password
      ) {
        sessionStorage.setItem(AUTH_KEY, "1");
        onLogin();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 350);
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-80 w-96 rounded-full bg-brand-50 blur-3xl" />
      </div>

      <div className="animate-rise-in relative w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Image
            src="/simples_carste.svg"
            alt="Carste"
            width={184}
            height={50}
            priority
            className="h-12 w-auto"
          />
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl border border-neutral-200/80 bg-white/90 p-8 shadow-xl shadow-neutral-900/5 backdrop-blur-sm"
        >
          <div className="mb-6 space-y-1.5">
            <h1 className="flex items-center gap-2 text-xl font-semibold text-neutral-900">
              <LockKeyhole className="h-5 w-5 text-brand-600" aria-hidden />
              Portal de Controles
            </h1>
            <p className="text-base text-neutral-500">
              Acesso restrito à equipe Carste. Entre com suas credenciais.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label
                htmlFor="login-username"
                className="text-sm font-medium text-neutral-600"
              >
                Usuário
              </label>
              <Input
                id="login-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Seu usuário"
                autoComplete="username"
                autoFocus
                required
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-sm font-medium text-neutral-600"
              >
                Senha
              </label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Sua senha"
                autoComplete="current-password"
                required
              />
            </div>

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-100">
                Usuário ou senha incorretos. Tente novamente.
              </p>
            ) : null}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                "Entrar"
              )}
              {!loading ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
            </Button>
          </div>
        </form>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-sm text-neutral-400">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          Ambiente de uso interno · segurança básica
        </p>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <main className="relative min-h-dvh">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-brand-100/50 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/favicon.ico"
              alt=""
              width={34}
              height={34}
              className="h-8 w-8 rounded-lg object-contain"
            />
            <div className="leading-tight">
              <p className="text-base font-semibold text-neutral-900">
                Carste · Controles
              </p>
              <p className="text-sm text-neutral-500">
                Central de acessos e status
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-base text-neutral-500 sm:block">
              Olá, equipe Carste
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-neutral-500 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
        <div className="animate-rise-in max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Tudo que a equipe precisa,{" "}
            <span className="text-brand-600">em um só lugar</span>
          </h1>
          <p className="mt-3 text-base leading-relaxed text-neutral-500 sm:text-lg">
            Acesse os sistemas Carste, consulte os logins de leitura e confira o
            status de cada plataforma — sem precisar procurar em e-mails ou
            planilhas.
          </p>
        </div>
      </section>

      {/* Projetos */}
      <section className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={project.slug}
              className="animate-rise-in"
              style={{ animationDelay: `${Math.min(index * 90, 360)}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
          <div className="animate-rise-in" style={{ animationDelay: "360ms" }}>
            <PlaceholderCard />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <p className="border-t border-neutral-200/70 pt-6 text-center text-sm text-neutral-400">
          Carste · Controles — ambiente de uso interno ·{" "}
          <a
            href="https://carste.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            carste.com.br
          </a>
        </p>
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Gate principal                                                      */
/* ------------------------------------------------------------------ */

export function PortalApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(AUTH_KEY) === "1");
  }, []);

  const handleLogin = useCallback(() => setAuthed(true), []);
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  }, []);

  if (authed === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  return authed ? <Dashboard onLogout={handleLogout} /> : <LoginScreen onLogin={handleLogin} />;
}
