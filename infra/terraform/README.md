# Terraform para PaneladeCasa

Este diretório contém a base para gerenciar a infraestrutura como código usando Terraform. É opcional, mas recomendado para provisionar recursos como banco de dados e armazenamento de arquivos em nuvem.

## O que está incluído

- Estrutura inicial em `infra/terraform/`
- Template para AWS em `infra/terraform/aws/` para:
  - PostgreSQL (RDS) para o backend (Prisma)
  - Bucket S3 para uploads (opcional)
- Arquivo `terraform.tfvars.example` com variáveis de exemplo

Se você preferir outro provedor (GCP, Azure, DigitalOcean, Railway), podemos adicionar rapidamente um template similar.

## Como se relaciona com o projeto

- Backend (NestJS + Prisma): usa `DATABASE_URL` (PostgreSQL). O Terraform pode provisionar um RDS e expor a URL de conexão.
- Uploads: por padrão usam armazenamento local; opcionalmente podemos usar S3. Caso use S3, você precisará configurar credenciais e apontar o backend para ele.

## Estrutura de pastas

- `aws/` – configuração pronta para iniciar na AWS (foco em ambiente de desenvolvimento)
  - `main.tf` – provedor, recursos principais (RDS + S3)
  - `variables.tf` – variáveis de entrada
  - `outputs.tf` – saídas (por ex.: `database_url`)
  - `terraform.tfvars.example` – exemplo de variáveis

## Pré-requisitos

- Conta no provedor de nuvem (por enquanto: AWS)
- Terraform >= 1.5
- Credenciais da AWS configuradas localmente (AWS CLI ou variáveis de ambiente)

## Passos rápidos (AWS)

1) Copie o arquivo de exemplo de variáveis e ajuste os valores:

- Windows PowerShell

```powershell
Copy-Item .\infra\terraform\aws\terraform.tfvars.example .\infra\terraform\aws\terraform.tfvars
```

- macOS/Linux

```bash
cp infra/terraform/aws/terraform.tfvars.example infra/terraform/aws/terraform.tfvars
```

2) Inicialize e valide o plano:

```powershell
cd infra/terraform/aws
terraform init
terraform plan
```

3) Aplique a infraestrutura:

```powershell
terraform apply
```

4) Pegue as saídas geradas (por exemplo, `database_url`) e configure no backend:

- Em `apps/backend/.env` (ou variável de ambiente no deploy):
  - `DATABASE_URL="<valor de output database_url>"`

Se usar S3 para upload:
- Ajuste o backend para usar S3 e configure as variáveis necessárias (ex.: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`).

## Observações importantes

- Template voltado a DEV: RDS pequeno, `skip_final_snapshot = true` e possivelmente público. Para produção, endureça a segurança (VPC privada, SGs restritos, snapshot, backups, multi-AZ etc.).
- Estados do Terraform: por padrão local. Para time/equipe, configure backend remoto (S3 + DynamoDB).

## Próximos passos

- Escolher o provedor de nuvem definitivo (AWS/GCP/Azure/DigitalOcean/Railway)
- Adicionar pipeline de CI/CD para validar/aplicar mudanças (opcional)
- Caso deseje, incluir ECS/Fargate ou outra plataforma para rodar os containers do backend/web
