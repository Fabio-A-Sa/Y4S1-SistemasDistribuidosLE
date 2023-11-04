# Message Oriented Midleware (MOM)

É uma comunicação assíncrona baseada em mensagens. O *sender* e o *receiver* não precisam de ser sincronizados, pois há um middleware que faz store às mensagens conforme precisam de ser enviadas. O sistema garante ordem e reliability. Alguns MOM proporcionam também uma abstração de *publishers* e *senders*. Há dois tipos de MOMs:

- `Point-to-point`: o modelo funciona como uma fila, onde vários senders colocam os dados na fila e vários receivers apanham os dados da queue. No entanto as mensagens são entregues por um único processo, já que há só uma fila para vários receptores.

- `Publisher-subscriber`: em vez de filas há tópicos, vários publishers colocam mensagens num certo tópico e os subscritores vão diretos àquele tópico. Assim, as mensagens podem ser enviadas por mais do que um processo.

A JMS (Java Message System) providencia uma implementação blocking e non-blocking deste comportamento.