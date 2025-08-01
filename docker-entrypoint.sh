#!/bin/sh

# Script para configurar a URL da API via variável de ambiente do Azure

echo "Configurando URL da API..."

# Criar arquivo de configuração JavaScript que será carregado pelo Angular
cat > /usr/share/nginx/html/env.js << EOF
window.env = {
    API_URL: "${API_URL}"
};
EOF

echo "API_URL configurada: ${API_URL}"

# Iniciar Nginx
nginx -g "daemon off;"
