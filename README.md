# Programação para Internet II - IFPI

Repositório agregador de projetos didáticos, práticas e gabaritos desenvolvidos na disciplina de **Programação para Internet II** do curso de **Tecnologia em Análise e Desenvolvimento de Sistemas (ADS)** no **Instituto Federal do Piauí (IFPI)**.

---

## 🎯 Objetivo

Centralizar os códigos de exemplo, atividades práticas e projetos guiados trabalhados em sala de aula, contemplando o desenvolvimento backend e full stack utilizando **JavaScript/TypeScript** e **Python**.

---

## 📂 Estrutura de Pastas

O repositório está organizado por tópicos e atividades de aprendizagem:

```text
.
├── topico1/          # Fundamentos e primeiras APIs / Atividades práticas
│   ├── atividade-atendimentos/
│   └── atividade-medicacao/
├── topico2/          # Arquitetura em camadas e organização de código
│   ├── projeto-base-camadas/
│   └── gabarito-atividade-camadas/
├── topico3/          # Persistência e regras de negócio
│   └── base-mini-prontuario-t3/
└── ...
```

---

## 🛠️ Tecnologias e Ferramentas

- **Linguagens**: TypeScript, JavaScript e Python
- **Ambientes**: Node.js, Python (venv)
- **Bancos de Dados**: SQLite
- **Plataforma / SO**: macOS / Linux / Windows

---

## 🚀 Como Executar os Projetos

Cada pasta contém seu próprio projeto isolado com suas respectivas dependências e configurações:

### 1. Projetos Node.js / TypeScript
1. Acesse o diretório do projeto desejado:
   ```bash
   cd topicoX/nome-do-projeto
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Caso exista um arquivo de variáveis de ambiente de exemplo (`.env.example`), crie o `.env`:
   ```bash
   cp .env.example .env
   ```
4. Execute os scripts disponíveis no `package.json` (geralmente `npm run dev` ou `npm start`).

### 2. Projetos Python
1. Acesse o diretório do projeto:
   ```bash
   cd topicoX/nome-do-projeto
   ```
2. Crie e ative um ambiente virtual:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Instale os pacotes necessários:
   ```bash
   pip install -r requirements.txt
   ```
4. Execute a aplicação conforme instruído no README do respectivo projeto.

---

## 👨‍🏫 Docente / Instituição

- **Curso**: Análise e Desenvolvimento de Sistemas (ADS)
- **Disciplina**: Programação para Internet II
- **Instituição**: Instituto Federal do Piauí (IFPI)
