# Physical and Logical Time

Como não há um referencial de tempo universal, precisa de haver uma sincronização entre as unidades. Pode haver sincronização:

- `Externa`, com banda D, quando é em relação a uma referência que impõe a medida de tempo;
- `Interna`, com banda 2D;

A obtenção de sincronicidade em sistemas assíncronos é baseada no `Berkeley Algorithm`, onde o clock é acertado com t + rtt/2 (adiciona metade do round-trip-time entre mensagens).

No entanto, por motivos de causalidade, ainda não é suficiente. Se dois nós não tiverem sincronização, é difícil prever o que causa determinadas mudanças.

## Clocks

Às vezes não é preciso haver sincronização de relógios, apenas ordenação de eventos, como enviar e receber mensagens.

### Lamport Clocks

A cada momento, o valor do clock é igual:
- Ao incremento default do nó, caso não tenha recebido mensagem;
- máximo(futuro incremento, clock do nó que cedeu mensagem) + 1;

Incrementar o lamport clock não é um evento. A principal limitação do Lamport Clock é que nem sempre L(e1) < L(e2) -> (e1 -> e2). Ou seja, não é por ter um timestamp inferior que há uma implicação direta entre eventos, pois podem ser concorrentes. Só permite verificar que não há causa direta entre e1 e e2, não comprova que são causais.

### Vector Clocks

Vem melhorar os Lamport Clocks. São atribuídos IDs a cada evento em cada nó. Cada nó tem um conjunto de **Causal Histories**. As mensagens são passadas através da união de conjuntos desses IDs.

> Node b, with [0, 1, 0] is receiving a message with [2, 0, 0] <br>
> We need to combine the two vectors and update b entry <br>
> Union([2, 0, 0],[0, 1, 0]) =  [2, 2, 2] <br>

- `Scaling` at the edge: usando Dotted Version Vectors (DVV);
- `Dynamic` concurrency degree: usando Interval Tree Clocks (ITC). Evita entidades pré-configuradas, o espaço (id-space) pode ser partido e juntado. No entanto cada entidade tem uma porção única e cada evento deve usar pelo menos parte dessa porção exclusiva;