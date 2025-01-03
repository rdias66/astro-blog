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

> **Dica:** Mesmo no plano gratuito, a AWS oferece diversos recursos sem custos por um ano, o que pode ser uma grande vantagem durante o desenvolvimento. No nosso fluxo, detalharei alternativas para alguns dos serviços da AWS que poderíamos utilizar, além de tornar o processo facilmente replicável, caso desejemos aplicá-lo em outra conta ao final do período gratuito

### 2. Configuração do IAM

Nesta etapa, vamos criar um usuário ou uma função no IAM com as permissões necessárias para que o OpenTofu (Terraform) possa gerenciar a infraestrutura de forma segura e eficaz.

1. **Acesse o IAM**: No painel da AWS, use a barra de pesquisa no canto superior esquerdo, digite "IAM" e selecione a primeira opção que aparecer, sob *Serviços*.
2. **Crie um Usuário**:
   - No menu à esquerda, na seção de gerenciamento de acesso, clique em "Usuários".
   - Na página de Usuários, clique em Criar "Usuario".
   - Seguiremos o processo de criação com as instruções da AWS até chegar à tela de Definir permissões.
   - Clique em "Anexar políticas diretamente", desta forma teremos mais controle dos acessos que nosso usuário terá, neste caso criaremos um usuário mestre para o OpenTofu e nossas possíveis manipulações manuais. Se em seu cenário, caso queira delegar funçoes de manutenção em produção para outros desenvolvedores em sua equipe, os proximos usuários que você criará podem ter permissões mais apropriadas a suas funções.
   - Agora selecionaremos a extensão dos acessos que nossa IaC conseguirá ter na nossa conta.

   Abaixo está uma tabela com as permissões recomendadas e alternativas(ào serviço da AWS)  para minimizar custos durante o desenvolvimento caso tenha interesse em delegar múltiplos usuários  com diferentes funções e acessos em sua infraestrutura.
   **_Para nosso caso apenas a seleção do Administrator Access é necessário, pois ele da acesso a todos os serviços da AWS_**  

| **Permissão**                 | **Descrição**                                                          | **Necessário?** | **Alternativa**          |
|-------------------------------|------------------------------------------------------------------------|-----------------|--------------------------|
| AdministratorAccess           | Permissão administrativa completa em todos os recursos.               | Sim             | N/A                      |
| AmazonS3FullAccess            | Acesso total ao S3 para armazenar o estado do Terraform.              | Não             | N/A                      |
| AmazonEC2FullAccess           | Acesso total ao EC2 para criação de instâncias.                       | Não             | N/A                      |
| AmazonRDSFullAccess           | Gerenciamento total do RDS.                                           | Não             | Container local          |
| AmazonVPCFullAccess           | Criação e gerenciamento de VPCs.                                      | Não             | N/A                      |
| AmazonEC2ContainerRegistryFullAccess | Gerenciamento completo do Amazon ECR para uso de contêineres Docker. | Não        | Docker Hub          |
| IAMFullAccess                 | Gerenciamento completo de usuários e permissões no IAM.(voltado para equipes)            | Não             | N/A |

> **Dica**: Algumas permissões são marcadas como "Não" para minimizar custos. O uso intensivo do ECR, por exemplo, pode gerar cobranças adicionais para armazenamento de novas tags de imagens. A ideia é maximizar o uso do *free tier* da AWS durante o desenvolvimento.

- Com a finalização da criação do usuário, clique nele na tabela de usuários, e na seção de resumo, identifique o botão 'Criar chave de acesso'.
- Selecione a opção 'Command Line Interface (CLI)', marque o checkbox de Confirmação no fim da seção e prossiga.
- Crie uma tag para identificar esta chave de acesso, algo como `iac-ak`.
- Finalizando, **guarde em lugares seguros e com backups os valores da AK(Access Key) e o Secret, esses valores serao usados em multiplas fases de nosso fluxo**


### 3. Criação de Bucket S3 para o estado do OpenTofu/Terraform
Para o OpenTofu ser aplicado precisaremos de uma forma de armazenar um arquivo de estado de nossa IaC. Esse arquivo é uma forma de gerenciar informações da estrutura do OpenTofu, como sincronização, segurança, versionamento e rastreabilidade.

- No console da AWS, navegue até o S3 via a barra de pesquise e clique para criar um novo bucket
- Utilize todos as marcações padrões que ja vem marcadas.
- Nomeie o bucket de forma única, algo como `iac-state-bucket`.
- O bucket deve ser criado na mesma região onde os recursos serão implantados, como `sa-east-1`.
- Ative o versionamento no bucket para rastrear mudanças no arquivo de estado do OpenTofu.

> **Terraform?**  Não estavamos usando o OpenTofu? Sim, porém o OpenTofu é um fork *open source* do terraform, entao veremos muito esse nome em nossa IaC. Em breve trarei um post sobre este assunto.


### 4. Coletar o ID da VPC ou Executar a Criação da VPC para as Ferramentas da Estrutura

Para as ferramentas que iremos instanciar via OpenTofu, uma VPC (Virtual Private Cloud) deve ser incluída para que as instâncias possam se conectar. Poderíamos realizar isso dinamicamente na IaC, porém sua complexidade acaba tornando mais fácil a criação prévia diretamente no console.

Normalmente, ao criar uma conta na AWS, uma VPC padrão é gerada para o usuário. Portanto, apenas precisamos obter o ID dessa VPC. Siga os passos abaixo:

Caso nao haja nada criado, execute os seguintes passos:

- Acesse a Barra de Pesquisa: No console da AWS, dirija-se à barra de pesquisa e procure por "VPC".
- Navegue para 'Suas VPCs': Clique em 'Suas VPCs' na dashboard à direita.
- Verifique a Lista de VPCs: Verifique se há alguma VPC listada (geralmente sem nome). Se existir, clique nela e copie o ID (algo parecido com vpc-123456789).
-Atualize as Variáveis do Projeto: Este valor será utilizado nas variáveis do projeto de infraestrutura (terraform.tfvars):]

``` bash
  vpc_id = "vpc-123456789"
 ```

 #### Caso não haja nenhuma VPC criada, execute os seguintes passos:

- Clique em "Criar VPC": No canto superior esquerdo do console da AWS, clique em "Criar VPC".
- Configure a VPC:
    Tipo de Recurso: Marque somente VPC.
    Nome: Nomeie a VPC da forma que preferir.
    CIDR IPv4: Defina o intervalo de CIDR IPv4 conforme sua preferência (entre /16 e /28).
    Opções Avançadas: Deixe todas as outras opções com os valores padrão.
- Crie a VPC: Clique em "Criar".
- Copie o ID da VPC: Após a criação, a VPC será gerada. Copie o ID da VPC na tela de detalhes, normalmente o primeiro item exibido.

-Atualize as Variáveis do Projeto: Este valor será utilizado nas variáveis do projeto de infraestrutura (terraform.tfvars):]

``` bash
  vpc_id = "vpc-123456789"
 ```


## Instalações e configurações locais

### 1. Instalação do AWS CLI
- Certifique-se de que o AWS CLI está instalado em sua máquina local. Caso não tenha, você pode seguir as instruções [aqui](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) para a instalação.
- Após a instalação, execute o comando `aws configure` no terminal e forneça os seguintes dados:
``` bash
  aws configure
 ```
  - Chave de acesso (Access Key) e chave secreta (Secret Access Key) do usuário criado no IAM, citados previamente.
  - Região padrão: defina como `sa-east-1` ou a região onde seus recursos serão implantados.
  - Formato de saída padrão: você pode deixar como `json` ou escolher outro de sua preferência.

### 2. Testar configuração do AWS CLI
- Para testar se o AWS CLI está configurado corretamente, execute um comando simples, como:

``` bash
  aws s3 ls
 ```

Com tudo isso pronto podemos começar nossa seção da Infraestrutura como código efetivamente!
