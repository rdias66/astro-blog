---
author: Rodrigo Dias
pubDatetime: 2024-12-16T15:51:52.737Z
title: Provisionamento de uma instância EC2 na AWS (Máquina virtual)
slug: provisionamento-de-uma-instancia-ec2
featured: false
tags:
  - aws
  - dai-repo
  - ec2
description: Configurações de estrutura e provisionamento de uma VM(EC2) com scripts de instalação de pacotes, ferramentas e rotinas.
---

Com sua instância EC2 criada via [Infraestrutura AWS COM OpenTofu](https://blog.rdias66.codes/posts/infra-aws-com-open-tofu), ou caso você já possua 
uma máquina virtual que deseja provisionar e configurar para otimizar e organizar seu ambiente de produção, este guia irá auxiliá-lo nesse 
processo com os seguintes passos: 

- Estruturização de diretórios
- Execução do script de provisionamento
- Configuração de rotinas

 Faremos isso com a base do repositório auxiliar : [Repositório aws-dai-repo](https://github.com/rdias66/aws-dai-repo) 

> Para entender mais sobre a estrutura do dai-repo em completo, recomendo a leitura do post: [O que é o dai-repo?](https://blog.rdias66.codes/posts/o-que-e-o-dai-repo)

#### Estruturização de diretórios

O primeiro passo é a organização de diretórios da nossa maquina virtual, faremos isso com base no repositório _aws-dai-repo_, que funciona também como diagrama de pastas para o servidor.

Partindo do pressuposto que a seção do guia de deploy presente no post [Infraestrutura AWS COM OpenTofu](https://blog.rdias66.codes/posts/infra-aws-com-open-tofu) foi concluída, vá ate a pasta raiz onde o repositório do dai-repo foi clonado e certifique-se que a chave .pem esta presente, de acordo com o exemplo:
![Exemplo do diretório raiz do dai-repo](https://github.com/rdias66/astro-blogfolio-assets/blob/main/tofu%20prints/root%20file%20struct%20example.png?raw=true)

Agora, iremos copiar toda esta estrutura para a nossa instância via o scp  (Secure Copy Protrocol para ssh), com o seguinte comando:

```bash
scp -i "my-ec2-key.pem" -r . ubuntu@ec2-xx-xx-x-xxx.sa-east-1.compute.amazonaws.com:~/
```

- **`-i "my-ec2-key.pem"`**: Usa a chave privada para autenticação.
- **`-r`**: Copia arquivos e pastas de forma recursiva.
- **`.`**: Indica que todos os arquivos e pastas do diretório atual serão copiados.
- **`ubuntu@ec2-xx-xx-x-xxx.sa-east-1.compute.amazonaws.com:~/`**: Destino da cópia, que será o diretório home do usuário `ubuntu`(que normalmente é o padrão na criação do modelo de VM escolhido em nossa estrutura) na instância EC2. 


Para obter o endereço **`ubuntu@ec2-xx-xx-x-xxx.sa-east-1.compute.amazonaws.com:~/`** , siga os passos:

Acesse o Console AWS e vá até o serviço EC2.
Encontre sua instância na lista de Instâncias.
Copie o Endereço IPv4 público da sua instância.
O formato do endereço será:
ubuntu@<IP público da instância>
Exemplo: ubuntu@ec2-12-34-5-678.sa-east-1.compute.amazonaws.com.

Este comando copia a estrutura de arquivos local para a instância EC2 de forma segura. 

Com estes arquivos copiados à sua instância, acessaremos ela para as outras etapas atraves do acesso direto pelo console, ou com o comando:

```bash
ssh -i "my-ec2-key.pem" ubuntu@ec2-xx-xx-x-xxx.sa-east-1.compute.amazonaws.com
```

Certifique-se que tudo foi copiado corretamente. O diretório _tofu/_ nao terá utilidade de dentro da instância, então podemos exclui-lo com o seguinte comando no nível onde este diretório se encontra:

```bash
rm -rf tofu
```

#### Execução do script de provisionamento

Agora, vamos focar no diretório scripts, onde desenvolveremos o provisionamento da infraestrutura, instalando pacotes e utilitários para o deploy de um app. O diretório contém três scripts, sendo o _setup.sh_ o principal para o provisionamento da infraestrutura, e dois scripts adicionais, que serão configurados em uma rotina no próximo passo (_clean-docker.sh_ e _clean-ecr.sh_).

`setup.sh` : Este script foi desenvolvido para automatizar a configuração inicial de uma máquina virtual (VM), transformando-a em um ambiente de produção otimizado e organizado. Ele realiza as seguintes tarefas:

- Atualização de pacotes do sistema.
- Criação de um usuário administrador com permissões adequadas.
- Instalação de ferramentas básicas e necessárias para administração e monitoramento.
- Instalação e configuração do Docker e Docker Compose, incluindo a criação de redes Docker.
- Instalação da AWS CLI e configuração das credenciais para facilitar a interação com serviços da AWS.

O objetivo é proporcionar um ambiente padronizado, seguro e pronto para hospedar aplicações em containers, garantindo a otimização do fluxo de trabalho e a manutenção da infraestrutura.

Para ver e analisar o script em sua intergridade : [setup.sh](https://github.com/rdias66/aws-dai-repo/blob/main/scripts/setup.sh)

No final do script, você será solicitado a fornecer suas credenciais AWS para configurar o AWS CLI, aqui você precisara dos dados de ak e secret do seu usuario IAM criado previamente( para mais sobre: [Configuração necessária no console AWS e setup local para deploy](https://blog.rdias66.codes/posts/configuracao-aws-console-e-local-para-deploy))

Preencha:
- AK (access key) e secret com os valores do IAM user (ele deve ter permissões de uso do ECR, por exemplo AmazonAdministratorFullAccess ou AmazonEC2ContainerRegistryFullAccess).
- A região padrão(default region name) de uso da infraestrutura ("sa-east-1" de acordo com nosso padrão)
- Formato padrão de output (JSON) 


#### Configuração de rotinas e scripts de limpeza

Nossa infraestrutura, já pensando na futura configuração de CI/CD, enfrenta dois problemas principais: custos excessivos com uma quantidade descontrolada de imagens residentes nos repositórios ECR e espaço de memória cheio na VM com imagens e containeres parados/nao utilizados. Essas rotinas têm como objetivo resolver esses problemas.

Para isso, faremos uso da ferramenta cron, que é um agendador de tarefas utilizado em sistemas Unix-like, como o Ubuntu. O cron permite que você execute comandos ou scripts automaticamente em horários ou intervalos específicos. O crontab (abreviação de "cron table") é o arquivo de configuração que define essas tarefas agendadas. Com o cron, podemos agendar rotinas que executam os scripts clean-docker.sh e clean-ecr.sh todos os dias, para evitar os problemas citados anteriormente.

Em resumo, cada script resolve o problema em que o seu nome propoe.

`clean-docker.sh`: Limpa as imagens não utilizadas e limpa os containeres parados e não utilizados da VM. Para ve-lo em sua integridade: [clean-docker.sh](https://github.com/rdias66/aws-dai-repo/blob/main/scripts/clean-docker.sh)

`clean-ecr.sh`: Remove todas as imagens presentes no repositório que não são a ultima criada(tag 'latest') pelo usuário e a penultima imagem antes da 'latest' por motivos de backup. Para ve-lo em sua integridade: [clean-ecr.sh](https://github.com/rdias66/aws-dai-repo/blob/main/scripts/clean-ecr.sh)

1 - Acesse o crontab no terminal de sua VM com o comando:

```bash
crontab -e
```
Exemplo da tela que editaremos:
![Exemplo do crontab -e](https://github.com/rdias66/astro-blogfolio-assets/blob/main/tofu%20prints/crontab%20-e%20example.png?raw=true)

De forma breve, é assim que a sintaxe do cron funciona:
```
* * * * * /caminho/do/comando
| | | | |
| | | | +--- Dia da semana (0 - 6) (Domingo = 0)
| | | +----- Mês (1 - 12)
| | +------- Dia do mês (1 - 31)
| +--------- Hora (0 - 23)
+----------- Minuto (0 - 59)
```

2 - Adicionar as Rotinas de Limpeza

Agora, vamos adicionar as rotinas para rodar os scripts de limpeza clean-docker.sh e clean-ecr.sh todos os dias. Adicione as seguintes linhas ao seu crontab(defina a frequência de execução das rotinas conforme sua necessidade, neste exemplo configuraremos uma para as 2 da manha e outra para as 3 da manha todo dia):
```bash
0 2 * * * sudo /home/ubuntu/scripts/clean-docker.sh

```

```bash
0 3 * * * sudo - E /home/ubuntu/scripts/clean-ecr.sh
```

> Note que o segundo comando , referente ao _clean-ecr.sh_ é diferente do primeiro com a flag "-E", ela garante que as variáveis de ambiente configuradas no setup.sh sejam passadas para o script, evitando problemas de autenticação no ECR.


Com isso, sua infraestrutura estará provisionada e pronta para os proximos passos do deploy, com pacotes atualizados, Docker e Docker Compose instalados, e scripts de limpeza configurados.
