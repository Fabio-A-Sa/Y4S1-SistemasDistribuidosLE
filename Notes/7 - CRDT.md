# Conflitc-Free Replicated Data Types (CRDT)

Baseia-se em dois pilares:

- `EC`, Eventual Consistency: é um caso especial de consistência fraca. Depois de um update, se novos updates não forem feitos, eventualmente todos os nós irão concordar no valor final;
- `CAP`, Consistency-Availability-Partition Tolerance, apenas é possível atingir e fixar dois destes três parâmetros em qualquer sistema;