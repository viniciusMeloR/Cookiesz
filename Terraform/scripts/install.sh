#!/bin/bash
set -e

echo "========================================="
echo "Iniciando configuração do Maple Storage"
echo "========================================="


# =========================================================
# ATUALIZAÇÃO DO SISTEMA
# =========================================================

apt update -y

apt install -y git curl wget unzip


# =========================================================
# NODE.JS
# =========================================================

echo "Instalando Node.js..."

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

echo "Node.js instalado:"
node -v

echo "NPM instalado:"
npm -v


# =========================================================
# CLOUDWATCH AGENT
# =========================================================

echo "========================================="
echo "Instalando CloudWatch Agent"
echo "========================================="

wget https://amazoncloudwatch-agent.s3.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

dpkg -i -E ./amazon-cloudwatch-agent.deb

rm amazon-cloudwatch-agent.deb

echo "CloudWatch Agent instalado!"


# =========================================================
# CONFIGURAÇÃO DO CLOUDWATCH AGENT
# =========================================================

echo "Configurando CloudWatch Agent..."

cat <<'EOF' > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
{
  "agent": {
    "metrics_collection_interval": 60,
    "run_as_user": "root"
  },

  "metrics": {
    "namespace": "MapleStorage/EC2",

    "metrics_collected": {
      "mem": {
        "measurement": [
          "mem_used_percent"
        ],
        "metrics_collection_interval": 60
      },

      "disk": {
        "measurement": [
          "used_percent"
        ],
        "metrics_collection_interval": 60,

        "resources": [
          "/"
        ]
      },

      "cpu": {
        "measurement": [
          "cpu_usage_idle",
          "cpu_usage_user",
          "cpu_usage_system"
        ],

        "metrics_collection_interval": 60,

        "totalcpu": true
      }
    }
  }
}
EOF

echo "Configuração criada!"


# =========================================================
# INICIAR CLOUDWATCH AGENT
# =========================================================

echo "Iniciando CloudWatch Agent..."

/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
  -s

echo "CloudWatch Agent iniciado!"


# =========================================================
# CLONAR PROJETO
# =========================================================

echo "========================================="
echo "Clonando projeto"
echo "========================================="

cd /home/ubuntu

git clone https://github.com/viniciusMeloR/Cookiesz.git

cd /home/ubuntu/Cookiesz


# =========================================================
# CRIAR .ENV
# =========================================================

echo "Criando arquivo .env..."

cat <<EOF > .env
AMBIENTE_PROCESSO=producao
APP_HOST=0.0.0.0
APP_PORT=${app_port}

DB_HOST=${rds_endpoint}
DB_DATABASE=${rds_database}
DB_USER=${rds_username}
DB_PASSWORD=${rds_password}
DB_PORT=3306
EOF


# =========================================================
# PERMISSÕES
# =========================================================

chown -R ubuntu:ubuntu /home/ubuntu/Cookiesz


# =========================================================
# INSTALAR DEPENDÊNCIAS
# =========================================================

echo "Instalando dependências..."

sudo -u ubuntu npm install


# =========================================================
# AGUARDAR RDS
# =========================================================

echo "========================================="
echo "Aguardando RDS..."
echo "========================================="

until timeout 2 bash -c "</dev/tcp/${rds_endpoint}/3306" 2>/dev/null
do
    echo "RDS ainda não está disponível..."
    sleep 10
done

echo "RDS disponível!"


# =========================================================
# PM2
# =========================================================

echo "Instalando PM2..."

npm install -g pm2

sudo -u ubuntu pm2 start app.js --name cookiesz

sudo -u ubuntu pm2 save


# =========================================================
# FINAL
# =========================================================

echo "========================================="
echo "Maple Storage configurado com sucesso!"
echo "CloudWatch Agent configurado com sucesso!"
echo "========================================="