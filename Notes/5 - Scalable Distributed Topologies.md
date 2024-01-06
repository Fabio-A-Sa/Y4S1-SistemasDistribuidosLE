# Scalable Distributed Topologies

## Graphs revision

- `Walk`: edges e vértices podem ser repetidos;
- `Trail`: apenas vértices podem ser repetidos;
- `Path`: nem vértices nem edges podem ser repetidos;

## Connections

- Random Geometric: as arestas são criadas uniformemente e diretamente sob os vértices disponíveis;
- Random Erdos-Renyi, G(n,p), n vértices são ligados e cada ligação tem uma probabilidade p de existir;
- Watts-Strogatz model, para construção de *small worlds*;
- Barabasi-Albert model: quanto maior for o nível de conexão do nó, mais provável de ser adicionado uma nova ligação. A distribuição dos graus dos nós é exponencial;

## Spanning Trees

Um grafo é strongly connected se, para um par de vértices U e V, existir um caminho entre V e U e de U para V. As distâncias computadas são mínimas.

Uma Spanning Tree é um sub-grafo criado a partir de Breath-First Search. A expansão começa no nó root (marked = true) e a partir daí dá-se a expansão de todos os nós (marked = false) e atribuição de parents. Em termos de tempo, a complexidade é igual ao diâmetro do grafo.

Há uma diferença entre `AsyncSpanningTrees` e `SyncBFS`. A `AsyncSpanningTrees` não cria necessariamente uma Breadth-First Spanning Tree pois beneficia caminhos mais longos e mais rápidos do que menores.

## Epidemic Broadcast Trees

### Gossip Broadcast

É mais escalável, mas peca pela troca de mensagens excessivas.

### Tree-based Broadcast

Tem menor complexidade de mensagens, mas é frágil na presença de falhas.

### Watts Strogatz Model

- Mistura contactos de pequeno e grande alcance;
- Os nós criam K contactos locais (pequeno alcance - ring or lattice) e mais alguns contactos de longo alcance através de uniformly random (como o algoritmo Erdos-Renyi);
- Resulta num pequeno diâmetro e grande clustering;
- Não é suficientemente bom a encontrar caminhos entre quaisquer dois nós, carece de localidade e forte ligação entre nós;

