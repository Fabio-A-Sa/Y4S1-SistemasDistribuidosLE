# Exam

## Topics

- [Message Oriented Midleware](#message-oriented-midleware-mom);
- [Replication and Consistency Models](#replication-and-consistency-models) 
- [Quorum Consensus](#quorum-consensus)
- [Byzantine Fault Tolerance](#byzantine-fault-tolerance) 
- [CRDTs](#crdts)
- [Scalable Distributed Topologies](#scalable-distributed-topologies)
- [Physical and Logical Time](#physical-and-logical-time)
- [Blockchain](#blockchain)

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
- Paxos Phase 1: PREPARE(N), se N for maior que um anterior PREP recebido, então responde com Promise e com o valor V de número mais alto que alguma vez já aceitou;
- Paxos Phase 2: se receber resposta da maioria, envia ACCEPT(n, v) com V igual ao seu ou o valor da proposta de maior número recebidas na fase 1. O aceitador aceita unless já tiver respondido a um PREPARE com N maior. Depois de aceitar, envia o valor para os Learners;
- SMR: determinação de um lider que roda a Paxos Phase 1 para haver progresso. Depois se alguém não tiver conhecimento do número na fase 2, o líder pode rodar NO-OP para essas instâncias. A falha do lider é rara (Paxos almost optimal), e o custo é praticamente o custo da fase 2;

## Byzantine Fault Tolerance

- Tolera F falhas se o sistema tiver N réplicas (N = 3F + 1);
- Detectam mensagens corrompidas através de criptografia e usam views, que são uma configuração do sistema numerado. Existe um timestamp nas mensagens trocadas para garantir uma semântica exactly once e o client espera por F + 1 replies com assinaturas válidas;
- Admite-se que quaisquer dois quoruns têm uma réplica em comum e há pelo menos um quorum sem réplicas a falhar;

## CRDTs

- Eventual Consistency;
- Consistency-Availability-Partition Tolerance (CAP), só é possível fixar duas destas três propriedades;
- State-based for high Availability

## Scalable Distributed Topologies

- Conexões podem ser geradas por: random geometric, random Erdos-Renyi (probabilidade p), Watts-Strogatz (small worlds), Barabasi-Albert (maior conexão do nó - maior probabilidade de adicionar uma nova conexão);
- AsyncSpanningTrees e SyncBFS;
- Watts Strogatz: cria K contactos locais e alguns outros de longo alcance com o algoritmo ER. Carece de localidade, mas tem pequeno diâmetro e grande clustering;
- P2P Gnuttela usa super-peers para minimizar impactos do PingPong;
- DHT Chord, cada nó tem um ID, localização rápida do sucessor;
- DHT Kademlia, roteamento simétrico, nós que partilham prefixos otimizam latência, a distância de identificação é feita com XOR operations;

## Physical and Logical Time

- Lamport Clocks, o seu incremento não é um evento e o seu valor é o incremento (quando não recebe mensagens) ou o max(futuro valor com incremento, timestamp da mensagem recebida) + 1, quando recebe mensagens;
- A principal limitação do Lamport Clock é que nem sempre L(e1) < L(e2) -> (e1 -> e2);
- Berkeley Algorithm, o local clock é atualizado com metade do round-trip-time;
- Vector clocks com melhoramentos: scalling at the edge usando DVV (Dotted version vectors) e Dynamic concurrency Degree, usando ITC (Interval Tree Clocks), que evita entidades pré-configuradas. O id-space pode ser partido e juntado para configurar eventos, cada entidade tem uma porção única do id para si e cada evento deve usar parte dessa porção exclusiva;
- Version Vector Clocks são Vector Clocks que só têm incremento quando há atualização do objecto que manipulam;

## Blockchain

- Blockchain baseada em ProofOfWork de Nakamoto: nonce no header do bloco até atingir um target;
- Broadcasting with anti-entropy: inventory, getdata. Delay is the bottleneck;
- Bitcoin forks, o block escolhe a chain maior depois de aprender com ela, podem ser itencionais, pioram roundtrip de mensagens, eventual consistency;
- Tendermint vs PBFT: não views, views, reliable broadcast, point-to-point, weighted voting, node-one vote, proposer changes every round and higher validator stake -> more rounds of proposer role, changes the view in a round;