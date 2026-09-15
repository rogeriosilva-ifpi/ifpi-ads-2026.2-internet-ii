/**
 * ============================================================
 * As regras de arquitetura, EXECUTÁVEIS.
 * ------------------------------------------------------------
 * Este arquivo é a camada 2 da escada de enforcement do
 * INVARIANTES.md: a regra deixou de ser texto (advisório) e
 * virou teste. Rode:  npm run arch
 *
 * O projeto chega com o arch VERMELHO de propósito: existem
 * 2 violações plantadas da Regra da Dependência. Encontrá-las
 * (Encontro 1) e corrigi-las (trilha ARQ) faz parte do curso.
 *
 * TODO ARQ-6 — a régua também evolui: quando os repositories
 * existirem, acrescente aqui a 4ª regra —
 *   "so-repositories-importam-o-driver": error para
 *   from ^src/(?!repositories) com to ^src/database ou @prisma.
 * Hoje ela não existe porque o SQL nos services é o estado
 * DOCUMENTADO de chegada — regra que sempre grita vira ruído.
 * ============================================================
 */
module.exports = {
  forbidden: [
    {
      name: "rotas-so-conhecem-controllers",
      comment:
        "Uma rota roteia. Se ela importa service ou banco, a fronteira Route/Controller vazou.",
      severity: "error",
      from: { path: "^src/routes" },
      to: { path: "^src/(services|repositories|database)" },
    },
    {
      name: "controllers-nao-tocam-o-banco",
      comment:
        "Controller traduz HTTP <-> domínio. Acesso a dados é papel do service (e, depois da trilha ARQ, do repository).",
      severity: "error",
      from: { path: "^src/controllers" },
      to: { path: "^src/(database|repositories)|^node_modules/(better-sqlite3|@prisma)" },
    },
    {
      name: "services-nao-conhecem-a-web",
      comment:
        "A Regra da Dependência: o domínio não sabe que a web existe. Service que importa express (ou middleware/controller/rota) inverteu a seta — mesmo que seja 'só um tipo'.",
      severity: "error",
      from: { path: "^src/services" },
      to: { path: "^src/(controllers|routes|middlewares)|^node_modules/(express|multer)" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
  },
};
