# Quoruns

Cada operação replicada no sistema necessita de um `quorum`, ou seja, um conjunto de réplicas. Nesses quoruns, se uma operação depende de outra operação, essas operações devem ser sobrepostas (ou seja, terem réplicas comuns). 

As répicas só possuem propriedades de leitura e escrita. Como o output de uma leitura depende da escrita anterior, o quorum da leitura deve ser sobreposto ao da escrita.

> NR + NW > N <br>
> NR - Número de réplicas de leitura <br>
> NW - Número de réplicas de escrita <br>
> N - Número total de ráplicas <br>

Cada réplica do objecto tem um número de versão. Mas isso não é suficiente pois pode haver falhas na partição e os valores ficarem diferentes entre ráplicas com o mesmo propósito (problema de concurrent writes). Podemos assegurar a consistência com `transactions`, onde 