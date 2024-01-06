# Exam

## Topics

- [Message Oriented Midleware](#message-oriented-midleware-mom);
- [Replication and Consistency Models](#replication-and-consistency-models) 
- [Quorum Consensus](#quorum-consensus)
- [Byzantine Fault Tolerance](#byzantine-fault-tolerance) 
- [CRDTs](#crdts)
- [Scalable Distributed Topologies](#scalable-distributed-topologies)
- []()

## Message Oriented Midleware (MOM)

- Internet Protocol Stack: App (servers), Transport (processos), Network (computadores não diretamente ligados), Interface (computadores diretamente ligados);
- UPD por mensagens e TCP por streams. UDP pode ser unicast ou multicast. TPC não garante que não há perdas nem garante que é reenvio de pacotes provavelmente perdidos, devido aos processos não serem sempre indepotentes;
- Client stub faz parameter marshalling e response unmarshalling;
- Point-to-Point: Fila única, mensagem recebida só por um;
- Publish-Subscriber: Vários tópicos, mensagem recebida por todos os subscritores;
- JMS Persistent: once-and-only-once, store da mensagem nalgo não volátil. Pode ser implementado por sessões e com AUTO_ACKNOWLEDGE, DUPS_OK_ACKNOWLEDGE, CLIENT_ACKNOWLEDGE, SESSION_TRANSATED;
- JMS Non-Persistent: at-most-once;
- JMS Topics Subscription: unshared (only one consumer at a time), shared, non-durable (enquanto existir um consumer ativo), durable (existe até ser explicitamente eliminada);

## Replication and Consistency Models

- Strong Consistency Models: sequential (operações por ordem, sistema multithread num single processor, não são composable), linear (é sequencial com sincronização, garante ordem temporal das operações, são operações concorrentes se houver um overlap nos tempos de execução, é composable), serial (sequential model for transaction-based systems);
- Weak Consistency Models, por motivos de performance e availability;

## Quorum Consensus

- Read depende de Write, logo R + W > N, mas Write depende de Write, logo W + W > N. Pode haver erros mesmo assim porque o nó de overlap pode falhar / não ficar atualizado / ter problemas de concorrência em writes. Usam-se transactions que abortam caso não recebam um ACK de um Write, garantem isolation, mas podem ter deadlocks (se usar locks) e blocking (se usar two-phase commit) caso o coordenador falhe;
- Operation Quorum de Gifford: lê de um quorum inicial e escreve para um quorum final. Quorum Final de write tem de estar ligado a: quorum inicial de escrita e quorum inicial de leitura;
- Herlihy’s Replication Method: timestamps, logs [t:(operação, results)], linearizability.
- **Dificuldade**: como saber o Minimal quorum?
- **Dificuldade**: Synod Algorithm, Paxos, SMR 

## Byzantine Fault Tolerance

- Tolera F falhas se o sistema tiver N réplicas (N = 3F + 1);
**Dificuldade**: estes slides

## CRDTs

- Eventual Consistency;
- Consistency-Availability-Partition Tolerance (CAP), só é possível fixar duas destas três propriedades;
- State-based for high Availability

## Scalable Distributed Topologies