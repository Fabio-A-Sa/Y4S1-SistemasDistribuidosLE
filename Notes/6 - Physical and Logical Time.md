# Physical and Logical Time

Como não há um referencial de tempo universal, precisa de haver uma sincronização entre as unidades. Pode haver sincronização:

- `Externa`, com banda D, quando é em relação a uma referência que impõe a medida de tempo;
- `Interna`, com banda 2D;

A obtenção de sincronicidade em sistemas assíncronos é baseada no `Berkeley Algorithm`, onde o clock é acertado com t + rtt/2 (adiciona metade do round-trip-time entre mensagens).

No entanto, por motivos de causalidade, ainda não é suficiente. Se dois nós não tiverem sincronização, é difícil prever o que causa determinadas mudanças.

## Vector Clocks

São atribuídos IDs a cada evento em cada nó. Cada nó tem um conjunto de **Causal Histories**, 