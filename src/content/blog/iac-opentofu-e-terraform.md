---
author: Rodrigo Dias
pubDatetime: 2024-10-25T15:16:52.737Z
title: IaC, OpenTofu e Terraform
slug: iac-opentofu-e-terraform
featured: false
tags:
  - devops
  - iac
description: Uma breve definição de IaC junto de uma analise das opções Terraform e OpenTofu
---

Ao planejar o fluxo de publicação e produção de um aplicativo, um dos primeiros pontos a considerar é a infraestrutura necessária para que a 
aplicação funcione de maneira eficaz. Seja para uma landing page básica ou um CRUD com frontend, backend e banco de dados, cada 
projeto exige uma base robusta de serviços que interagem entre si. Em uma análise mais simples, um aplicativo precisa de um serviço 
para versionar e manter seu código, uma plataforma ou máquina virtual para executar esse código e um banco de dados que se comunique de forma eficaz com 
o restante da aplicação, dentro ou nao da máquina virtual. Isso resulta em uma rede complexa de serviços que precisam ser criados, configurados e integrados. Realizar essas tarefas manualmente pode se tornar um processo longo e minucioso, 
demandando organização e um conhecimento da plataforma. Quando é necessário replicar essa infraestrutura em estágios futuros, a tarefa
se torna ainda mais desafiadora. É nesse contexto que a Infraestrutura como Código (IaC) se torna uma solução valiosa, oferecendo automação e 
modularização em código da nossa infraesturura, simplificando esse processo.

Porém esta prática nao tras apenas benefícios, antes da aplicação desse tipo de ferramente um compreendimento dos pros e contras é essencial: 


| **Benefícios de IaC**                            | **Malefícios de IaC**                          |
|--------------------------------------------------|------------------------------------------------|
| **Automação e Escalabilidade**                   | **Curva de Aprendizado**                       |
| Economiza tempo e facilita a escalabilidade.     | Exige tempo para aprender ferramentas e conceitos. |
| **Repetibilidade e Consistência**                | **Complexidade em Ambientes Extensos**         |
| Facilita a criação de ambientes consistentes.    | Código longo e difícil de manter em grandes infraestruturas. |
| **Controle de Versão**                           | **Risco de Erros em Massa**                    |
| Permite rastrear e auditar mudanças de forma fácil. | Erros de código podem afetar múltiplos recursos. |
| **Facilidade de Gestão e Manutenção**            | **Necessidade de Gerenciamento de Estado**     |
| Infraestrutura documentada                       | Problemas no *state* podem causar inconsistências. |
| **Redução de Erros Humanos**                     | **Dependência de Ferramentas e Provedores**    |
| Automatização reduz erros comuns manuais.        | Mudanças em APIs e ferramentas podem exigir ajustes. |
| **Agilidade no Desenvolvimento**                 | **Complexidade em Auditoria e Segurança**      |
| Equipes podem criar e modificar ambientes rapidamente. | Infraestrutura automatizada exige forte segurança. |
| **Economia de Custos**                           | **Tempo de Implementação**     |
| Identifica e elimina recursos desnecessários.    | Implementação inicial pode ser demorada. |

Com tudo isso em mente, um dos objetivos deste post(além de futuros tutoriais práticos) é diminuir a curva de aprendizado e atravéz de organização e testes 
diminuir riscos e problemas de implementação de uma estrutura como código.

Hoje no ambiente de DevOps temos duas principais ferramentas disponíveis para aplicarmos este conceito. O mais utilizado no mercado e open source(por enquanto) 
*Terraform*, e o *OpenTofu* que vem surgindo com  facilidades de integração e migração(Terraform -> OpenTofu), que ja surge para prever futuros problemas
 da política de uso do Terraform.
Embora o Terraform e o OpenTofu compartilhem uma base técnica quase idêntica devido ao fato de OpenTofu ser um fork do Terraform, existem diferenças 
importantes a serem consideradas. Ambos utilizam uma linguagem declarativa para definir infraestrutura como código (IaC) e seguem o mesmo esquema de
configuração em blocos para facilitar a leitura e escrita. No entanto, o OpenTofu surge como uma alternativa ao Terraform com o objetivo de oferecer 
mais liberdade ao usuário, especialmente devido à recente mudança de licença do Terraform, que agora é restritiva para certos usos comerciais. 
O OpenTofu também se compromete a manter compatibilidade com a sintaxe e os módulos do Terraform, facilitando a migração entre as ferramentas.
Em termos de funcionalidade e suporte aos principais provedores de nuvem, ambos ainda operam de forma quase idêntica, mas o
OpenTofu destaca-se pela promessa de uma governança mais aberta e sem restrições de uso, buscando atrair a comunidade que valoriza software 
realmente livre. Caso tenha curiosidade em saber mais da relação desses softwares,recomendo a leitura do [Manifesto do OpenTofu](https://opentofu.org/manifesto/)


## 1 - Sintaxe

Tanto o Terraform quanto o OpenTofu usam a HashiCorp Configuration Language (HCL). Com ela, definimos recursos em um formato de bloco, 
permitindo que infraestruturas sejam descritas/declaradas em módulos que correspondem ao que precisa existir.

Exemplo de sintaxe:

```bash
  resource "aws_ec2_instance" "my_ec2_instance" {
    ami           = "ami-12345678"
    instance_type = "t2.micro"
  }
```
Neste exemplo, o bloco cria uma instância EC2 (máquina virtual) do tipo `t2.micro`. Claro que há muito mais detalhes técnicos que podem ser listados nesse formato de "declaração de variáveis", mas a lógica do desenvolvimento dos blocos de infraestrutura segue esse formato.

A sintaxe básica é idêntica entre Terraform e OpenTofu, já que o OpenTofu é compatível com os módulos do Terraform, facilitando tanto replicações quanto migrações de uma infraestrutura existente.

## 2 - Lógica, Compenentização e Organização de arquivos

Ambas as ferramentas recomendam a modularização, levando o código a ser construído em blocos reutilizáveis, organizados em pastas referentes a módulos específicos relacionados a uma parte da infraestrutura. A estrutura de uma pasta de módulo é a seguinte:

Variáveis (`variables.tf`): Aqui, parametrizamos os valores e configurações referentes aos dados técnicos específicos aos requisitos deste módulo. Por exemplo, podemos definir um limite maior de espaço para um banco de dados ou uma máquina mais ou menos potente para uma VM.

Módulo (`main.tf`): Nesta seção, organizamos os blocos de configuração deste módulo específico, que podem variar de grupos de segurança (permissões de entrada/saída e interações) até as especificações técnicas. Neste caso, atrelamos possíveis variáveis ao instanciamento do módulo.

Outputs (`outputs.tf`): Valores de saída que facilitam o compartilhamento de dados entre módulos, organizando e promovendo a comunicação entre diferentes partes do código. Por exemplo, o ID de um módulo de uma VPC (Virtual Private Cloud) que será utilizado por uma EC2 (máquina virtual) e um RDS (banco de dados), permitindo que ambos estejam na mesma VPC e possam se comunicar e interagir.

Provider (`provider.tf`): Configuração dos provedores de nuvem(AWS, Azure, etc)

Exemplo de estrutura de pastas:

```bash
├── main.tf            
├── variables.tf      
├── outputs.tf         
├── provider.tf        
└── modules/           
    ├── vpc/           
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    ├── ec2/
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf         
    └── s3/            
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```


## 4 - Estado e Gerenciamento de Versionamento

O estado é uma peça fundamental para ambas as ferramentas. Ele permite que o código saiba o que já foi aplicado na infraestrutura e o que precisa ser atualizado, removido ou criado. Esse estado pode ser gerenciado de maneira local ou remota, sendo que o armazenamento remoto é mais recomendado para equipes, pois permite o compartilhamento e o versionamento do estado entre múltiplos desenvolvedores.


Caso se interesse por aprender de forma prática a aplicação de uma IaC em OpenTofu para um deploy de um app fullstack na AWS, acompanhe os posts nas tags de IaC aqui nesse mesmo blog!