# Backend Developer Technical Assessment

## Primeiros passos

- Antes de tudo abra uma conta na [aws](https://aws.amazon.com/) e no [serverless.com](https://www.serverless.com/).
- Crie um usuário [iam na aws](https://us-east-1.console.aws.amazon.com/iam/home) com permissão 'AdministratorAccess' crie sua chave de acesso para esse usuário e guarde as credenciais.
- Intale o Docker e docker compose na sua maquina, [tutorial](https://docs.docker.com/get-docker/).

## Environment
### Env global
- Na raiz do projeto crie um arquivo com o nome .env e cole o código a baixo dentro desse arquivo.

```
# api
PORT=3001

# database
DB_NAME=Plooral
DB_USER=postgres
DB_PWD=123456
DB_HOST=postgres
DB_PORT=5432
DB_DIALECT=postgres
DB_PORT_LOCAL=5433

# aws iam
ACCESS_KEY_ID=
SECRET_ACCESS_KEY=

# aws S3
BUCKET=plooral
KEY=feeds.json
```

- Depois pegue suas credenciais do usuario aws iam e cole nas chaves ACCESS_KEY_ID e SECRET_ACCESS_KEY.

### Env serverless
- Crie outro arquivo .env só que dessa vez dentro da pasta `serverless`, e cole o código a baixo la dentro (não se preocupe com a variável BASE_URL ela será preenchida nos próximos passos).

```
BASE_URL=
BUCKET=plooral
KEY=feeds.json
```

### Build

- Primeiro abra um terminal na raiz do projeto e rode o seguinte comando:
```
docker-compose up
```
- No final do processo o servidor já estará rodando no `http://localhost:3001` deixe esse terminal aberto rodando a api.
- Um banco de dados PostgreSQL também estará rodando na porta 5433 da sua máquina, já com 3 companies inseridas (o modelo do banco e as companies pré inseridas seguiram as especificações do arquivo models.sql dentro da pasta ddl).
- Em um novo terminal rode o comando:
```
docker ps
```
- Ele vai listar todos os seus container que estão rodando, procure pelo container `api` e copie o seu CONTAINER ID

- Rode o comando a baixo para acessar o terminal bash do container api, substituindo o `<CONTAINER ID>` pelo id que você copiou no ultimo passo:
```
docker exec -it <CONTAINER ID> bash
```
- No terminal do contêiner rode o comando a baixo para criar uma URL do seu serviço local para que a aws lambda possa consultar o serviço na nuvem:
```
lt --port 3001
```
- Não feche o terminal deixe o serviço rodando, copie a URL fornecida e cole ela no arquivo .env na pasta serverless `BASE_URL=<url gerada>` e salve o arquivo.

- Em um novo terminal abra novamente o bash do contêiner:
```
docker exec -it <CONTAINER ID> bash
```
- E execute o comando a baixo para se logar no serverless:
```
serverless login
```
- Como você esta dentro de um contêiner o site não abrira automaticamente no seu browser por isso copie a url informada e cole no seu browser a rota, ela vai te levar para uma pagina de login crie sua conta ou faça o login, ao final você recebera essa mensagem no terminal `You are now logged into the Serverless Framework`.
- Veja novamente o conteúdo de GET `http://localhost:3001/feed`, se ele continuar vazio espere 1 minuto e o estado do arquivo no S3 vai atualizar.

### User Actions

Convert the following use cases into API endpoints:

- `GET /companies`: List existing companies.
- `GET /companies/:company_id`: Fetch a specific company by ID.
- `POST /job`: Create a job posting draft.
- `PUT /job/:job_id/publish`: Publish a job posting draft.
- `PUT /job/:job_id`: Edit a job posting draft (title, location, description).
- `DELETE /job/:job_id`: Delete a job posting draft.
- `PUT /job/:job_id/archive`: Archive an active job posting.

### Integration Features

- Implement a `GET /feed` endpoint to serve a job feed in JSON format, containing published jobs (column `status = 'published'`). Use a caching mechanism to handle high traffic, fetching data from an S3 file updated periodically by an AWS Lambda function. The feed should return the job ID, title, description, company name and the date when the job was created. This endpoint should not query the database, the content must be fetched from S3.
- This endpoint receives a massive number of requests every minute, so the strategy here is to implement a simple cache mechanism that will fetch a previously stored JSON file containing the published jobs and serve the content in the API. You need to implement a serverless component using AWS Lambda, that will periodically query the published jobs and store the content on S3. The `GET /feed` endpoint should fetch the S3 file and serve the content. You don't need to worry about implementing the schedule, assume it is already created using AWS EventBridge. You only need to create the Lambda component, using NodeJS 20 as a runtime.

### Extra Feature (Optional)

- **Job Moderation**: using artificial intelligence, we need to moderate the job content before allowing it to be published, to check for potential harmful content.
Every time a user requests a job publication (`PUT /job/:job_id/publish`), the API should reply with success to the user, but the job should not be immediately published. It should be queued using AWS SQS, feeding the job to a Lambda component.
Using OpenAI's free moderation API, create a Lambda component that will evaluate the job title and description, and test for hamrful content. If the content passes the evaluation, the component should change the job status to `published`, otherwise change to `rejected` and add the response from OpenAI API to the `notes` column.

### Bonus Questions

1. Discuss scalability solutions for the job moderation feature under high load conditions. Consider that over time the system usage grows significantly, to the point where we will have thousands of jobs published every hour. Consider the API will be able to handle the requests, but the serverless component will be overwhelmed with requests to moderate the jobs. This will affect the database connections and calls to the OpenAI API. How would you handle those issues and what solutions would you implement to mitigate the issues?
   
2. Propose a strategy for delivering the job feed globally with sub-millisecond latency. Consider now that we need to provide a low latency endpoint that can serve the job feed content worldwide. Using AWS as a cloud provider, what technologies would you need to use to implement this feature and how would you do it?

RESPOSTA: AWS clowdFront talvez seja uma solução.

## Próximos passos

- Implementar a Extra Feature.
- Implementar testes na api.
- Mudar a lógica do aws lambda para em vez de atualizar o estado do arquivo S3 a cada um minuto atualizar toda vez que um novo job for publicado.

