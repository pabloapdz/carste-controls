/**
 * Dados dos projetos da Carste exibidos no portal de controles.
 * As credenciais aqui são acessos de somente leitura fornecidos pela Carste
 * (não são dado sensível) e ficam visíveis para uso interno.
 */

export type Access = {
  /** Rótulo/tipo do acesso, ex.: "Acesso Geral" */
  label: string;
  /** Nome do usuário / empresa */
  user: string;
  login?: string;
  password?: string;
};

export type Project = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  url: string;
  /** path da screenshot (`plataforma.png`) */
  platformImage: string;
  /** path do logo do projeto (`logo.png`) */
  logo: string;
  /** logo adicional do cliente (ex.: Anglo) */
  clientLogo?: string;
  clientName?: string;
  accesses: Access[];
  /** exibe o widget de última atualização (MySQL) */
  showStatus?: boolean;
};

export const projects: Project[] = [
  {
    slug: "carste-seismography",
    name: "Carste Seismography",
    shortName: "Seismography",
    description:
      "Portal de sismografia com monitoramento 24/7 de redes sísmicas nos clientes.",
    url: "https://carste-seismography.com/admin/overview",
    platformImage: "/projetos/carste seismography/plataforma.png",
    logo: "/projetos/carste seismography/logo.png",
    showStatus: true,
    accesses: [
      {
        label: "Empresa",
        user: "Lundin",
        login: "Lundin",
        password: "Sismografia@2026",
      },
      {
        label: "Empresa",
        user: "Mineração IPE",
        login: "MineraçãoIPE",
        password: "SismografiaIPE",
      },
      {
        label: "Empresa",
        user: "Gerdau",
        login: "Gerdau",
        password: "Gerdau@2026",
      },
      {
        label: "Empresa",
        user: "Samarco",
        login: "Samarco",
        password: "Samarco@2026",
      },
      {
        label: "Empresa",
        user: "Carste Protótipo",
        login: "Prototipo",
        password: "Carste@2026",
      },
      {
        label: "Admin",
        user: "Mateus Barbosa",
        login: "mateus.barbosa@carste.com.br",
        password: "Carste2026",
      },
      {
        label: "Admin",
        user: "Thiago Sampaio",
        login: "thiago.sampaio@carste.com.br",
        password: "Carste2026",
      },
    ],
  },
  {
    slug: "carste-monitoramentos",
    name: "Carste Monitoramentos",
    shortName: "Monitoramentos",
    description:
      "Sistema de monitoramentos sísmicos do projeto Anglo American, com geração de relatórios.",
    url: "https://carste-monitoramentos.com.br/dashboard/relatorio-monitoramento",
    platformImage: "/projetos/carste monitoramentos/plataforma.png",
    logo: "/projetos/carste monitoramentos/logo.png",
    clientLogo: "/projetos/carste monitoramentos/LogoAnglo.png",
    clientName: "Anglo American",
    accesses: [
      {
        label: "Acesso Geral",
        user: "Sismografia AA",
        login: "SismografiaAA",
        password: "Anglo@2026",
      },
      {
        label: "Acesso Relatórios",
        user: "Desmonte AA",
        login: "DesmonteAA",
        password: "Desmonte@2026",
      },
      {
        label: "Acesso Admin",
        user: "Gerência Carste",
        login: "GerenciaCarste",
        password: "Carste@2026",
      },
    ],
  },
  {
    slug: "sismodash",
    name: "SimoDash",
    shortName: "SimoDash",
    description:
      "Dashboard de simulações e indicadores de desmonte (SimoDash) hospedado na AWS.",
    url: "https://master.d2d4piytz2d5a4.amplifyapp.com",
    platformImage: "/projetos/sismodash/plataforma.png",
    logo: "/projetos/sismodash/logo.png",
    accesses: [],
  },
];

/** Credenciais de acesso ao próprio portal (hardcoded — segurança básica). */
export const PORTAL_CREDENTIALS = {
  username: "carste",
  password: "carste",
} as const;
