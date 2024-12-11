---
author: Rodrigo Dias
pubDatetime: 2024-11-11T14:11:52.737Z
title: Infraestrutura AWS com OpenTofu
slug: infra-aws-com-open-tofu
featured: true
tags:
  - devops
  - iac
  - opentofu
  - dai-repo
description: Configuração da seção do OpenTofu no repositório auxiliar de deploy para AWS(dai-repo) 
---

Neste post, vamos explorar em detalhes a configuração necessária para criar uma infraestrutura na AWS utilizando IaC com o OpenTofu([Por que usar o OpenTofu?](https://blog.rdias66.codes/posts/iac-opentofu-e-terraform)). Ao final, teremos a estrutura para o deploy na AWS criada, com uma instância EC2 com acesso SSH configurado, uma instância RDS, repositórios de contêineres para a aplicação e um bucket de mídia, caso a aplicação precise. 

 Esse tutorial usa como referência o repositório auxiliar de deploy para AWS, o `aws-dai-repo`, que foi a ferramenta que desenvolvi para organizar e estabelecer todas as partes do deploy de uma aplicação. 

Para entender melhor o uso de módulos no OpenTofu, focaremos na pasta `tofu/`, que replica a forma padrao de configurar uma IaC, seja ela com Terraform ou OpenTofu. Podemos comparar esses modulos à classes na programação orientada a objetos. Assim como classes definem características e comportamentos que são especificados ao criar uma instância dessa classe, os módulos definem recursos de infraestrutura que serão criados, configurados e gerenciados de forma modular e reutilizável. Nesta estrutura, vamos configurar uma infraestrutura AWS que suporta um aplicativo full stack (backend, frontend e banco de dados), usando instâncias baseadas nos módulos de serviços da AWS. Para um entendimento mais aprofundado do planejamento, confira este post sobre  [Planejamento DevOps para Deploy na AWS](https://blog.rdias66.codes/posts/planejamento-devops-para-deploy-aws).

> Antes de avançarmos, é importante ter toda a configuração inicial pronta no console da AWS e no ambiente local (como AWS CLI, Git etc.). Caso precise de ajuda com essa etapa, você pode seguir este guia: [Configuração necessária no console AWS e setup local para deploy](https://blog.rdias66.codes/posts/configuracao-aws-console-e-local-para-deploy) 


Esses primeiros passos girarão em torno do repositório auxiliar, entao vamos começar clonando o repositório aws-dai-repo em sua máquina. No diretório de sua preferência, execute:

`git clone https://github.com/rdias66/aws-dai-repo.git`


Para entender mais sobre a estrutura do dai-repo, recomendo também o post: [O que é o dai-repo?](https://blog.rdias66.codes/posts/o-que-e-o-dai-repo)

## Estrutura do diretório `tofu/`

- **modules/**: Aqui estão os módulos de serviços, que são configurações reutilizáveis de infraestrutura. Usando a analogia anterior, esses módulos são como classes que definem moldes para criar serviços específicos no ambiente de produção.

- **production/**: Esta pasta é o módulo de produção, onde fazemos o instanciamento completo da infraestrutura. Ela usa os módulos para criar instâncias de serviços (como EC2, RDS, ECR), definir variáveis de ambiente que o OpenTofu usará, e configurar as regras de segurança da estrutura (grupos de segurança).

A seguir a estrutura detalhada do diretório com uma breve descrição, os arquivos contém comentarios explicativos em todos os arquivos.

```bash

└── tofu/                 
    ├── modules/           
        ├── ec2/           
            ├── main.tf
            ├── variables.tf
            └── outputs.tf
        ├── ecr/
            ├── main.tf
            └── variables.tf       
        ├── rds/            
            ├── main.tf
            ├── variables.tf
            └── outputs.tf
        ├── s3/            
            ├── main.tf
            ├── variables.tf
            └── outputs.tf    
    └── production/
        ├── security-groups/ #configurações de acesso e permissões entre si e para a internet
            ├── main.tf
            ├── variables.tf
            └── outputs.tf
        ├── main.tf #instanciamento dos modulos necessários para infraestura, neste nível que rodaremos os comandos tofu(init play apply)
        ├── variables.tf # organização de variaveis a partir das variaveis de ambiente
        └── terraform.tfvars.example # exemplo de arquivo de variaveis de ambiente, funcionamento similar às .envs 
```

## Execução da IaC:

1 - Criar e popular o arquivo `terraform.tfvars`:
  Este arquivo deve ser criado no mesmo nivel que o seu exemplo `tofu/production/terraform.tfvars.example`. Esse exemplo ja tem configurado em si todos os valores necessários para a estrutura de nosso planejamento, mas caso tenha curiosidade ou queira ter certeza que tudo isso esteja de acordo com suas necessidades, de uma olhada na documentação da AWS para estes serviços.

- [AWS Regions and Availability Zones](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html)
- [Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [Amazon EC2 Instance Types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html)
- [Amazon Machine Images (AMI)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)
- [Amazon RDS for PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
- [Using Bucket Policies in Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-bucket-policies.html)

2 - Inicializar o OpenTofu:

Com tudo configurado, inicie o OpenTofu executando o seguinte comando no nível de diretório `tofu/production/`:

```bash
tofu init
```
Esse comando inicializa o diretório de trabalho para OpenTofu, baixando os plugins e módulos necessários para o provedor AWS.

O resultado do init deve ser este:
![Sucesso no tofu init](https://github.com/rdias66/astro-blogfolio-assets/blob/main/tofu%20prints/tofu%20init%20success.png?raw=true)

3 - Planejar a Execução:

Para revisar as mudanças que o OpenTofu aplicará, execute:

```bash
tofu plan
```
O comando tofu plan mostra um resumo de todas as alterações que o OpenTofu fará em sua infraestrutura. Essa etapa é crucial para identificar possíveis problemas antes da aplicação das configurações. 

O resultado do plan deve ser este:
![Sucesso no tofu plan](https://github.com/rdias66/astro-blogfolio-assets/blob/main/tofu%20prints/tofu%20plan%20sucess.png?raw=true)

Atente-se que no meu exemplo as mudanças foram poucas, neste caso a estrutura ja está criada e apenas fiz mudanças para exemplificação!

4 - Corrigir Configurações se Necessário:

Se o OpenTofu mostrar mensagens de erro ou inconsistências durante o planejamento, ajuste os valores conforme recomendado. A CLI do OpenTofu fornece detalhes sobre o que precisa ser corrigido.

5 - Aplicar as Configurações:

Após confirmar que o plano de execução está correto, aplique as configurações com
```bash
tofu apply
```

Este comando vai lhe perguntar se as mudanças listadas deve ser aceitas:
![Tofu apply input](https://github.com/rdias66/astro-blogfolio-assets/blob/main/tofu%20prints/tofu%20apply%20input.png?raw=true)

Depois de sim, este deve ser o resultado final, atente-se que neste exemplo as mudanças e criações executadas em minha infraestrutura foram apenas 2, uma mudança e uma criaçao, na primeira vez que voce rodar isso, o output será diferente!

![Tofu apply success](https://github.com/rdias66/astro-blogfolio-assets/blob/main/tofu%20prints/tofu%20apply%20success.png?raw=true)

6 - Ajustes finais

Caso ocorram erros durante a aplicação, o OpenTofu mostrará instruções para correção. Revise as configurações e execute novamente tofu apply até que a infraestrutura seja criada com sucesso.

Ao final, você terá uma infraestrutura básica na AWS, configurada e pronta para o deploy do seu aplicativo. Essa configuração inclui a instância EC2, um banco de dados RDS, repositórios ECR para imagens Docker, e um bucket S3 para armazenamento de mídia do projeto. Porém isto pode variará de acordo com os modulos que voce utilizou em sua IaC.

Um ponto importante é realizar a configuração da Conexão EC2-RDS no Console AWS  

Para configurar a conexão entre sua instância EC2 e o banco de dados RDS diretamente pelo Console AWS, siga os passos abaixo:  

6.1 Acesse o serviço **RDS** no Console AWS.  
6.2 Localize e clique na instância RDS que deseja configurar.  
6.3 Na página de detalhes da instância, clique no botão **Ações** no canto superior esquerdo.  
6.4 Selecione a opção **Configurar conexão EC2**.  
6.5 Escolha a instância EC2 que deverá acessar o banco de dados.  
6.6 Confirme as configurações sugeridas (o AWS automaticamente ajustará os grupos de segurança para permitir a conexão) e clique em **Salvar**.  


### Acesso à maquina virtual 

Com a sua instância EC2 criada, é crucial garantir que você tenha acesso direto a ela, pois isso será fundamental para o futuro do nosso processo de deploy. A AWS duas principais formas de acesso a esta instância, via ssh(Você precisa ter uma ferramenta SSH instalada em seu PC para isso) ou diretamente no console. Para isso, precisamos criar uma chave de acesso SSH `.pem` **com o mesmo nome definido na variável `key-name`** no arquivo `terraform.tfvars`. Siga os passos abaixo para configurar essa chave:


#### Acesso Diretamente pelo Console AWS  

1. No navegador, faça login na AWS Management Console. 
2. No painel **EC2**(barra de pesquisa > EC2), localize a instância que deseja acessar na lista de instâncias.  
3. Com a seção de detalhes da instancia selecionada aberta, identifique e clique no botão **"Conectar"** na parte superior da página.  
4. A AWS apresentará as opções de acesso:  
   - **Sessão EC2 no Console:** Esta é a primeira opção carregada e permite que você acesse diretamente pelo próprio console da AWS, sem a necessidade de ferramentas externas.  


#### Acesso SSH (túnel de sua maquina local > EC2)

1. Identifique o Nome da Chave SSH  

Abra o arquivo `terraform.tfvars` e localize a variável `key-name`. Por exemplo:  
```hcl
key-name = "my-ec2-key"
```

2. Acesse o Console da AWS

No navegador, faça login na AWS Management Console e procure pelo serviço EC2.

3. Crie o Par de Chaves SSH  

3.1 No painel **EC2**, clique na opção **"Pares de chaves"** (Key Pairs) no menu lateral.  
3.2 Clique no botão **"Criar par de chaves"**.  
3.3 Preencha os campos:  
   - **Nome:** Insira exatamente o mesmo nome configurado na variável `key-name` (por exemplo, `my-ec2-key`).  
   - **Formato:** Escolha o formato **PEM** (necessário para conexão via SSH).  
3.4 Clique em **"Criar par de chaves"**.  

4. Baixe e Salve o Arquivo .pem

O arquivo .pem será automaticamente baixado para o seu computador.
Mova o arquivo para o mesmo diretório onde está o arquivo terraform.tfvars, ou para um local seguro de sua escolha. Este arquivo será necessário para acessar sua instância EC2 no futuro.
> Crie backups e guarde-os em locais separados, este arquivo é importante, e não pode ser baixado novamente! 


5. Acesso SSH

Com tudo pronto podemos nos conectar a instancia com o seguinte comando, no mesmo nivel onde a chave .pem baixada previamente está. 

```
ssh -i "my-ec2-key.pem" ubuntu@ec2-instance-example.sa-east-1.compute.amazonaws.com
```
