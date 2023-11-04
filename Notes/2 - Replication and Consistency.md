# Replication and Consistency Models

A replicação de dados em vários nós é uma solução escalável mas tem um grande desafio: garantir a consistência dos dados em todo o sistema.

## Strong Consistency Models

Modelo em que todas as réplicas conseguem executar e aplicar updates pela mesma ordem. Os updates são portanto determinísticos. Modelos:

### Sequential Consistency Model

Uma execução é consistente a nível sequencial se for idêntica a uma execução das tarefas pelas várias threads do sistema. Não é composta, ou seja, não há garantias de consistência na ordem de manipulação de várias estruturas de dados.

### Linearizability

Uma execução é linearizável se é sequencial consistent e se uma operação OP1 acontecer antes de uma operação OP2 sob o ponto de vista de um observador externo, então OP1 aparecerá antes de OP2. A linearização não é possível em arrays sem sincronização. Ao contrário da sequencialização, esta pode ser composta por várias estruturas de dados. 

### Serializability

Para sistemas baseados em transações. 