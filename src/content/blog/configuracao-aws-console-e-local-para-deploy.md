---
author: Rodrigo Dias
pubDatetime: 2024-10-24T19:28:52.737Z
title: Configuração necessária no console AWS e setup local para deploy
slug: configuracao-aws-console-e-local-para-deploy
featured: true
tags:
  - devops
  - aws 
  - dai-repo
description: Descrição detalhada das configurações necessárias diretamente no console AWS e instalações locais para o ínicio do deploy com o dai-repo.
---

Para o ínicio da execução do fluxo que planejamos no post anterior, precisamos fazer algumas configurações diretamente no console da AWS, que vão desde a criação da conta, até as permissões de seus ou seu usuário (caso queira um usuário único), além de instalar as ferramentas locais na máquina da onde o deploy será executado. Então dividiremos esta seção em 2 partes.

## Console AWS

### 1. Criação da conta AWS
Antes de qualquer coisa, é necessário criar uma conta na AWS caso ainda não tenha uma. Acesse [aws.amazon.com](https://aws.amazon.com) e siga as instruções para criar sua conta gratuita, você precisará cadastrar um cartão de crédito, então se atente ao _plano gratuito!_ Com a conta criada, faça login no console da AWS.

> **Dica:** Mesmo utilizando o plano gratuito, a  aws oferece muitos recursos sem custos por um ano, o que pode ser vantajoso durante o desenvolvimento, em nosso fluxo detalharei alternativas a alguns serviços da aws que poderiamos usar, além do processo ser facilmente replicavél para ser repetido em uma outra conta no fim desse ano.

### 2. Configuração do IAM
Crie um usuário ou role no IAM com as permissões necessárias para o OpenTofu (Terraform) gerenciar sua infraestrutura. Abaixo está uma tabela com as permissões necessárias:

| **Permissão**             | **Descrição**                                      | **Necessário?** | **Alternativa**          |
|---------------------------|----------------------------------------------------|----------------|--------------------------|
| AmazonS3FullAccess         | Acesso total ao S3 para armazenar o estado do Terraform. | Sim            | N/A                      |
| AmazonEC2FullAccess        | Acesso total ao EC2 para criação de instâncias.    | Sim            | N/A                      |
| AmazonRDSFullAccess        | Gerenciamento total do RDS.                       | Não            | Container local          |
| AmazonVPCFullAccess        | Criação e gerenciamento de VPCs.                  | Sim            | N/A                      |
| AmazonECRFullAccess        | Acesso total ao ECR para repositório de imagens Docker. | Não            | Docker Hub               |

> **Nota:** Anotei algumas opções como necessárias ou não para diminuirmos ao máximo possíveis custos em nossa infraestrutura,  o ecr com uso excessivo de novas tags de imagens pode gerar custos, ainda que baixos. Entao manteremos como objetivo o uso máximo do *freetier*


### 3. Criação de Bucket S3 para o estado do OpenTofu/Terraform
Para o OpenTofu ser aplicado precisaremos de uma forma de armazenar um arquivo de estado de nossa IaC. Esse arquivo é uma  forma de gerenciar informações da estrutura do OpenTofu, como sincronização, segurança, versionamento e rastreabilidade.

- No console da AWS, navegue até o S3 e crie um novo bucket.
- Nomeie o bucket de forma única, algo como `seu-nome-terraform-bucket`.
- O bucket deve ser criado na mesma região onde os recursos serão implantados, como `sa-east-1`.
- Ative o versionamento no bucket para rastrear mudanças no arquivo de estado do Terraform.

> **Terraform?**  Não estavamos usando o OpenTofu? Sim, porém o OpenTofu é um fork *open source* do terraform, entao veremos muito esse nome em nossa IaC. Em breve trarei um post sobre este assunto.

## Instalações e configurações locais

### 1. Instalação do AWS CLI
- Certifique-se de que o AWS CLI está instalado em sua máquina local. Caso não tenha, você pode seguir as instruções [aqui](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) para a instalação.
- Após a instalação, execute o comando `aws configure` no terminal e forneça os seguintes dados:
  - Chave de acesso (Access Key) e chave secreta (Secret Access Key) do usuário criado no IAM.
  - Região padrão: defina como `sa-east-1` ou a região onde seus recursos serão implantados.
  - Formato de saída padrão: você pode deixar como `json` ou escolher outro de sua preferência.

### 2. Testar configuração do AWS CLI
- Para testar se o AWS CLI está configurado corretamente, execute um comando simples, como:
  ```bash
  aws s3 ls
