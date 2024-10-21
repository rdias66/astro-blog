---
author: Rodrigo Dias
pubDatetime: 2024-10-21T11:28:52.737Z
title: Planejamento DevOps para deploy na AWS
slug: planejamento-devops-para-deploy-aws
featured: true
tags:
  - DevOps
  - AWS 
  - DAI-repo
  - Github Actions
description: Uma introdução ao planejamento requerido para um deploy completo na AWS, com a arquitetura da IaC, configurações de domínio, reverse proxy, containerização e setup de CI/CD.
---

# Planejamento DevOps para Deploy na AWS

Este post é o início de uma série de conteúdos que visa mapear e guiar o fluxo de um deploy completo na AWS. Utilizaremos como base o repositório [deploy-assist-infra](https://github.com/rdias66/aws-deploy-assist-infra) ou *dai-repo*, onde centralizaremos a infraestrutura, scripts de setup e configurações essenciais para nossos serviços.

Vamos cobrir desde a configuração inicial até a manutenção da infraestrutura em produção. Partimos da premissa de que já temos um aplicativo pronto, com backend e frontend em repositórios separados.

## Passos Principais

- **Criação da conta AWS**
- **Configurações no Console AWS**  
  (Usuário IAM, access key e secret)
- **Instalações e Configurações Locais**  
  (AWS CLI, OpenTofu, Docker)
- **Preenchimento e Ajustes nos Módulos de IaC**
- **Containerização do App**
- **Preparação do Ambiente Virtual (VM) para Deploy**
- **Configurações de Domínio e Certificados**
- **Configuração do Reverse Proxy e Docker Networks**
- **Configuração das Envs de Produção**  
  (Sincronia com o serviço de DB, como RDS ou um container na própria VM)
- **Desenvolvimento da CI/CD com GitHub Actions**
- **Primeira Release**
- **Guia de Manutenção e Comandos de Produção**
- **Testes de Performance da API** (Opcional)

## Detalhamento do Processo

O foco principal deste fluxo é garantir a escalabilidade e modularização dos estágios do deploy. Abaixo, um resumo simplificado de cada etapa:

1. **Criar a conta AWS**  
   onde a infraestrutura será provisionada .
   
2. **Configurar um usuário mestre**  
   dentro da conta criada para uso com a AWS CLI local, permitindo criação e manipularização diretamente no console AWS.

3. **Instalação do AWS CLI e OpenTofu na sua máquina local**  
   para transformar nossa infraestrutura em código (IaC), modularizando os serviços que nosso app utilizará:
   - **EC2** para a máquina virtual onde os repositórios serão hospedados.
   - **RDS** para o banco de dados (suporta apenas DBs relacionais).
   - **ECR** para gerenciar as imagens dos containers.
   - **Buckets S3** para armazenar dados do deploy e arquivos de mídia.

4. **Planejamento e aplicação da IaC**  
   atravéz do repositorio auxiliar de deploy [dai-repo](https://github.com/rdias66/aws-deploy-assist-infra), exploraremos as possibilidades e configuraremos atravéz de variaveis de ambiente toda a infraestrutura que será criada na AWS.

5. **Configuração de domínio e certificados**  
   caso você tenha ou queira configurar um domínio próprio para o app, configuraremos ele atravéz da Cloudflare(ou Lets Encrypt), para a geração dos certificados de rede, e redirecionamento do domínio para o ip publico da instância EC2 gerada no passo anterior(os requests serão recebidos e servidos via nosso reverse proxy, no caso, escolhi o Nginx).


6. **Configurar a CI/CD**  
   nos repositórios utilizando GitHub Actions para realizar o primeiro deploy, e a contínua implementação de novos commits a partir do branch principal(main).

7. **Primeira release e gestão/manutenção dos containers**  
   um guia geral com comandos úteis para a gestão dos containers e a realização de testes e troubleshooting na infraestrutura em produção, incluindo uma seção opcional de stress testing da API.

Com este guia, espero que você, seja um desenvolvedor júnior ou de qualquer nível de experiência, consiga compreender este fluxo e adquirir uma visão clara e estruturada sobre como implementar um deploy completo na AWS utilizando as melhores práticas de DevOps. Cada etapa descrita é fundamental para garantir não apenas o sucesso no lançamento do seu aplicativo, mas também sua manutenção eficiente e escalável no ambiente de produção.
