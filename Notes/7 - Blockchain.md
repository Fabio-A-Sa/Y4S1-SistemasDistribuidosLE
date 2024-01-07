# Blockchain

Como fazer pagamentos diretos online sem passar por 3rd party systems?

## Bitcoin

A bitcoin é um record de transactions que ocorrem numa P2P network com nodes com alguma computational resources. Cada account tem duas persistent private and public keys.

## Blockchain

A blockchain é uma corrente de blocos, cada um com até no máximo 1MB, que guardam transações de criptomoedas. O primeiro bloco é o `genesis` e o último é o `head`. Cada bloco tem um head que aponta para o bloco imediatamente anterior, sendo ligados porque o hash depende também da identificação do bloco anterior.

Cada peer da ligação mantém uma cópia da blockchain toda. Como garantir a consistência entre todos? Têm de manter *consensus*, através do Protocolo de Nakamoto, baseado em `Proof-of-work`.

### Proof of Work (PoW)

Encontrar um `nouce` para induzir no block header, em SHA-256, para que seja menor que um target conhecido de antemão. É um trabalho unicamente de força bruta, cuja dificuldade é incrementada a cada 2016 blocos minerados. 

### Broadcasting with Anti-entropy

Após validar o bloco, o peer responsável envia um INV (inventory) com todos os hashes da blockchain que conhece para todos os vizinhos. Caso algum vizinho não conheça algum, pede um "getdata", de modo a que o primeiro retorne o seu conhecimento. O delay de propagação é um *bottleneck* do sistema. 

### Bitcoin Forks

Quando dois ou mais nós têm diferentes blocos no head, diferentes blocks estão incluídos em diferentes blockchains. O bloco perdedor muda para a blockchain maior quando aprender sobre ela. Há forks intencionais quando um peer lança um INV enquanto está a aprender sobre os existentes à sua volta. <br>
Não há 100% de garantias que um bloco esteja presente no final, mas com 6 confirmações o bloco já é considerado final. Há portanto uma `eventual consistency`.

### Bitcoin Issues



## Tendermint vs. PBFT

Tendermint’s authors claim it is simpler than PBFT, ▶ It does not use view changes, e.g.
but I found the PBFT description easier to read ▶ Some other differences:
Communication layer PBFT uses point-to-point communication, whereas Tendermint uses "reliable broadcast"
Voting PBFT uses one node-one vote, whereas Tendermint uses weighted voting: the vote of a validator is proportional to its stake, i.e. account balance
Leader in PBFT, the leader changes with the view in a round-robin fashion, whereas in Tendermint:
▶ the proposer (leader) changes in every round
▶ the higher a validator’s stake, the more rounds it will play the
role of proposer