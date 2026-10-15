# MatchPoint — atualização da segunda entrega

## Alterações
- Sessão validada no backend por GET /auth/me ao recarregar a página.
- Usuário autenticado abre Minhas partidas, sem repetir login.
- Token inválido ou expirado exige login; falhas de rede permitem tentar novamente sem apagar o token.
- Endereço opcional, com até 300 caracteres, no cadastro, edição, lista e detalhes.
- Botão Abrir no Google Maps usando endereço, ou nome do local quando não informado.
- Horário com campo próprio de hora.
- Identificador do organizador incluído na listagem da API.

## Aplicar
1. Preserve seus arquivos .env; eles não estão neste pacote.
2. Na pasta backend, execute:
   npm ci
   npx prisma generate
   npx prisma migrate deploy
   npm run build
3. Reinicie/republique o backend antes de publicar o frontend.
4. Na raiz do projeto, execute:
   npm ci
   npm run build
5. Publique frontend e backend com as variáveis de ambiente já usadas no projeto.

A migração adiciona somente a coluna opcional address à tabela Match e mantém os registros anteriores. Use DATABASE_URL do banco correto. Faça backup antes da atualização de produção.

## Conferência após publicar
- Faça login, pressione F5 e confirme que permanece em Minhas partidas com sua identidade.
- Saia, pressione F5 e confirme que o login aparece.
- Com sessão expirada, confirme que o login é solicitado.
- Interrompa a conexão durante a restauração: deve mostrar erro e Tentar novamente, sem apagar o token.
- Crie uma partida com endereço; abra os detalhes e o Google Maps.
- Edite o endereço, salve e confira os detalhes.
- Abra uma partida antiga sem endereço e confira que continua funcionando.

## Validação local
Compilação do frontend e backend e geração do cliente Prisma. Não foram aplicadas migrações em banco real nem realizados testes no site publicado. A sessão continua com validade de uma hora conforme configuração existente do backend; esta alteração não amplia esse prazo.

## Segunda rodada de melhorias
- Filtros combináveis por esporte, data e local/endereço, com limpeza e contagem de resultados.
- Minhas partidas separado em Organizadas por mim e Vou participar.
- Cobrança: Grátis (padrão) ou Pago por pessoa. Valores são armazenados em centavos; não há processamento de pagamento.
- Observações opcionais, com limite de 2000 caracteres.
- Partidas antigas passam a ser gratuitas por padrão; edite se necessário.

Para atualizar sua pasta atual: pare ambos os terminais com Ctrl+C, copie os arquivos deste pacote por cima do projeto e preserve seus dois arquivos .env. Em backend, execute npm.cmd install, npx.cmd prisma generate, npx.cmd prisma migrate deploy e npm.cmd run dev, um por vez. Em outro terminal, na raiz, execute npm.cmd install e npm.cmd run dev.

Teste filtros combinados e limpeza; as duas categorias; criação grátis; criação paga com R$ 25,50; edição de paga para grátis; observações após salvar e recarregar. Confira também o login com F5 e o mapa. Compilações aprovadas; validações do serviço verificadas com repositórios simulados, sem banco real. Testes no navegador e migração devem ser realizados no seu ambiente.

## Interface e esportes
Seleção visual com 28 modalidades e Outro esporte, ícones nas partidas, identidade visual verde e lima, cartões e formulários renovados e adaptação para telas menores. Este pacote inclui todas as migrações e melhorias anteriores. Preserve os arquivos .env locais ao substituir os arquivos. Os ícones de esporte são emojis e podem variar conforme o sistema operacional.
