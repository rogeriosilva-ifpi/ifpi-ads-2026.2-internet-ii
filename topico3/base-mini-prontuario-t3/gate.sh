#!/usr/bin/env bash
# ============================================================
# gate.sh — o portão do repositório
# ------------------------------------------------------------
# A versão estudantil do "gauntlet": nenhuma entrega, humana ou
# de agente, está pronta antes deste script sair VERDE.
# É este arquivo que transforma "Done when" em algo que uma
# MÁQUINA avalia — afirmação não é evidência; a saída dele é.
#
# Uso:   npm run gate      (ou: bash gate.sh)
# Saída: código 0 = verde. Qualquer outra coisa = não entregue.
#
# NOTA PEDAGÓGICA: o projeto CHEGA com a checagem 2 vermelha
# (2 violações plantadas de arquitetura). A trilha ARQ existe
# para deixá-la verde — e mantê-la verde para sempre.
# ============================================================
set -u
FALHAS=0

passo() {
  echo ""
  echo "──────────────────────────────────────────────"
  echo "▶ $1"
  echo "──────────────────────────────────────────────"
}

# ---------- 1. Tipos ----------
passo "1/4 Tipos (tsc --noEmit)"
if npx tsc --noEmit; then
  echo "✔ tipos ok"
else
  echo "✘ erros de tipo"; FALHAS=$((FALHAS+1))
fi

# ---------- 2. Arquitetura ----------
passo "2/4 Arquitetura (dependency-cruiser)"
if npx depcruise src --config .dependency-cruiser.cjs; then
  echo "✔ regras de dependência respeitadas"
else
  echo "✘ violação da Regra da Dependência (veja acima)"; FALHAS=$((FALHAS+1))
fi

# ---------- 3. Testes ----------
passo "3/4 Testes de API (node:test, servidor real em porta efêmera)"
if npm run --silent test; then
  echo "✔ testes verdes"
else
  echo "✘ testes falharam"; FALHAS=$((FALHAS+1))
fi

# ---------- 4. Segredos ----------
passo "4/4 Segredos no repositório (gitleaks)"
if command -v gitleaks >/dev/null 2>&1; then
  if gitleaks detect --no-banner --source .; then
    echo "✔ nenhum segredo detectado"
  else
    echo "✘ possível segredo commitado (invariante OP-2)"; FALHAS=$((FALHAS+1))
  fi
else
  echo "⚠ gitleaks não instalado — checagem pulada (instale: https://github.com/gitleaks/gitleaks)"
  echo "  Regra da casa: checagem pulada NÃO conta como verde em entrega final."
fi

echo ""
echo "=============================================="
if [ "$FALHAS" -eq 0 ]; then
  echo "GATE VERDE ✔ — pronto para PR (cole ESTA saída como evidência)"
  exit 0
else
  echo "GATE VERMELHO ✘ — $FALHAS checagem(ns) falhando. Não entregue assim."
  exit 1
fi
