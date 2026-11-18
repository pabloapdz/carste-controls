"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, KeyRound, Sparkles } from "lucide-react";
import type { Project } from "@/lib/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusWidget } from "@/components/status-widget";
import { AccessDialog } from "@/components/access-dialog";

export function ProjectCard({ project }: { project: Project }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral-900/5">
        {/* Screenshot */}
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
          <Image
            src={project.platformImage}
            alt={`Captura de tela do ${project.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          {/* Logo do projeto */}
          <div className="absolute left-4 top-4 flex items-center gap-2 drop-shadow-sm">
            <Image
              src={project.logo}
              alt={`Logo do ${project.name}`}
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl bg-white/90 object-contain p-1 shadow-sm ring-1 ring-black/5"
            />
            {project.clientLogo ? (
              <Image
                src={project.clientLogo}
                alt={`Logo de ${project.clientName}`}
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl bg-white/90 object-contain p-1 shadow-sm ring-1 ring-black/5"
              />
            ) : null}
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl">{project.name}</CardTitle>
          </div>
          <CardDescription className="text-base leading-relaxed">
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4">
          {project.showStatus ? <StatusWidget /> : null}

          <div className="mt-auto flex items-center gap-1.5 pt-1">
            <Button asChild className="min-w-0 flex-1 px-3">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-0 items-center gap-1.5"
              >
                <span className="truncate">Acessar sistema</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
              </a>
            </Button>
            {project.accesses.length > 0 ? (
              <Button
                variant="secondary"
                className="min-w-0 flex-1 px-3"
                onClick={() => setDialogOpen(true)}
              >
                <KeyRound className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">Credenciais</span>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {project.accesses.length > 0 ? (
        <AccessDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          projectName={project.name}
          accesses={project.accesses}
        />
      ) : null}
    </>
  );
}

export function PlaceholderCard() {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 border-dashed border-neutral-300 bg-transparent p-8 text-center shadow-none">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-inset ring-brand-100">
        <Sparkles className="h-6 w-6 text-brand-500" aria-hidden />
      </div>
      <div className="space-y-1.5">
        <p className="text-lg font-medium text-neutral-800">
          Aguardando mais projetos
        </p>
        <p className="text-base text-neutral-500">
          Novos sistemas da Carste serão adicionados aqui em breve.
        </p>
      </div>
      <Badge variant="neutral">Em breve</Badge>
    </Card>
  );
}
