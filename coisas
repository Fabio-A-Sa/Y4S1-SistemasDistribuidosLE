----

node client.js

lança uma thread principal (T1) que:

- se não existir bd, cria;
- fazer load do conteúdo para um CRDT volátil;
- cria mais uma thread (T2);

a partir daqui o CRDT tem de ser manipulado sempre com controlo de concorrência (!!)

T1:
    - responsável por atender aos pedidos do cliente com get() e put() do CRDT
    - perioricamente faz store() do conteúdo do CRDT na DB. fazer open() e close() ao ficheiro não volátil sempre. É um processo de Fault Tolerance. Se algo crashar a base de dados local vai ter (quase?) todas as alterações do cliente. Na próxima "node client.js" tudo volta correcto.

T2:
    - responsável por fazer polling ao proxy sempre que perder a conexão
    - se algo for mudado no CRDT (*), envia esse CRDT
    - espera pela resposta. A resposta deve conter o merge() dos dados enviados com o que o servidor tem. Atualiza o CRDT local.

(*) Como vai saber que algo foi mudado?
- Mandar sempre tudo está fora de questão, é perda de recursos.
- Talvez apostar no CRDT com estados, averiguar a possibilidade.

Desta forma não precisamos de timestamps ou dirtys na DB. Da mesma forma, não precisamos de transactions na DB, porque ela irá só ser manipulada pela T1.

---

node proxy.js

um proxy permite:

- sistema end-to-end sem o user conhecer a implementação, ou as portas dos servers, ou o número de servers do cluster. Basta conhecer uma única porta, talvez enviada no argumento.
- não necessitar de uma ligação fixa 1-1 entre client e server;

Deverá ser implementado um load balancer (existe em ZeroMQ!) porque assim não haverá perdas de performance nem bottle-necks em pedidos exaustivos a um único servidor.

Atenção: o proxy passa a ser um ponto de falha no sistema.

---

node server.js

semelhante (?) a um client, mas sem a parte frontend. Ou com a parte de frontend simples só para ver os logs.

lança uma thread principal (T1) que:

- se não existir BD, cria;
- fazer load do conteúdo para um CRDT volátil;
- cria mais uma thread (T2);

a partir daqui o CRDT tem de ser manipulado sempre com controlo de concorrência (!!)

T1:
    - responsável por atender aos pedidos que vêm do proxy. esses pedidos são mensagens em forma de CRDT:
        - recebe, faz merge() do que já tem na CRDT local e atualiza-a;
        - envia a CRDT resultante de volta;
    - perioricamente faz store() do conteúdo do CRDT na DB. fazer open() e close() ao ficheiro não volátil sempre. É um processo de Fault Tolerance. Se algo crashar, a base de dados local vai ter (quase?) todas as alterações. Na próxima "node server.js" tudo volta correcto.

T2:
    - responsável por verificar se o CRDT foi atualizado;
    - se algo for mudado no CRDT (\*\*), envia esse CRDT ao coordinator (\*\*\*);

(**) Como vai saber que algo foi mudado?
- Mandar sempre tudo está fora de questão, é perda de recursos.
- Talvez apostar no CRDT com estados, averiguar a possibilidade.

(***) O que é um coordinator?
- Uma entidade conhecida por todos os server do cluster AND que conhece todos os servers do cluster. Como fazer essa associação? Escrita num ficheiro
- O envio por parte de S1 de um CRDT ao coordinator implica o envio do mesmo para S2..SN (replicas);
- O proxy pode ser o coordinator? Penso que não, mas investigar.

Atenção: o coordinator passa a ser um ponto de falha no sistema

CRDT design: