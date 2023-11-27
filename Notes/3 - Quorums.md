# Quorums

Cada operação replicada no sistema necessita de um `quorum`, ou seja, um conjunto de réplicas. Nesses quoruns, se uma operação depende de outra operação, essas operações devem ser sobrepostas (ou seja, terem réplicas comuns). 

As répicas só possuem propriedades de leitura e escrita. Como o output de uma leitura depende da escrita anterior, o quorum da leitura deve ser sobreposto ao da escrita.

> NR + NW > N <br>
> NR - Número de réplicas de leitura <br>
> NW - Número de réplicas de escrita <br>
> N - Número total de ráplicas <br>

Cada réplica do objecto tem um número de versão. Mas isso não é suficiente pois pode haver falhas na partição e os valores ficarem diferentes entre ráplicas com o mesmo propósito (problema de concurrent writes). Podemos assegurar a consistência com `transactions`:
- a transação aborta se houver problema em pelo menos um nó, fazendo com que não hava inconsistência dentro de um mesmo tipo de quórum;
- a transaction também previne inconsistências devido a writes concurrentes;
- mas a transaction tem problemas de *deadlocks* entre elas e de *blocking* se o coordinator falhar;

### Dynamo Quorums

- Um coordenador é um dos primeiros N servidores da lista de preferências para aquela chave;
- Na operação put(key, value, context), o coordenador gera um vetor de versão para a nova versão e grava o novo valor localmente.
- Em seguida, envia o par chave-valor e seu vetor de versão para os primeiros N servidores na lista de preferência da chave.
- A operação put() é considerada bem-sucedida se pelo menos W-1 réplicas responderem.
- Na operação get(key), o coordenador solicita todas as versões do par (chave, valor), incluindo os vetores de versão correspondentes, dos servidores restantes na lista de preferência.
- Ao receber as respostas de pelo menos R-1 réplicas, o coordenador retorna todos os pares (chave, valor) cujos vetores de versão são máximos.

## Quorum Consensus

Um quorum de uma operação é um conjunto de réplicas cuja cooperação é suficiente para executar a operação e é constuído por um quorum inicial e um quorum final. Há leitura a partir de um quorum inicial e escrita para um quorum final, ou seja, numa operação de leitura, o quorum final está vazio (porque só há escrita).

As restrições de intercepção são definidas entre o o quorum final de uma operação e o quorum inicial da operação seguinte.

### Gifford's RW Quorums

Um ficheiro sujeito a operações read/write com as seguintes restrições:

- Cada quorum final de escrita precisa interceptar cada quorum inicial de leitura
- Cada quorum final de escrita precisa interpeptar cada quorim inicial de escrita