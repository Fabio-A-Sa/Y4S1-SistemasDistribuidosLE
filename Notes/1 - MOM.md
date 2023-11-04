# Message Oriented Midleware (MOM)

É uma comunicação assíncrona baseada em mensagens. O *sender* e o *receiver* não precisam de ser sincronizados, pois há um middleware que faz store às mensagens conforme precisam de ser enviadas. O sistema garante ordem e reliability. Alguns MOM proporcionam também uma abstração de *publishers* e *senders*. Há dois tipos de MOMs:

- `Point-to-point`: o modelo funciona como uma fila, onde vários senders colocam os dados na fila e vários receivers apanham os dados da queue. No entanto as mensagens são entregues por um único processo, já que há só uma fila para vários receptores.

- `Publisher-subscriber`: em vez de filas há tópicos, vários publishers colocam mensagens num certo tópico e os subscritores vão diretos àquele tópico. Assim, as mensagens podem ser enviadas por mais do que um processo.

A JMS (Java Message System) providencia uma implementação blocking e non-blocking deste comportamento. Tem dois modos de envio que proporcionam diferentes trade-offs entre reliability e performance:

### Persistent

Garante uma semântica once-and-only-once, ou seja, um crash no servidor não deve causar uma perda da mensagem enviada ou ser enviada em duplicado. Requer que se faça store à mensagem em modo não-volátil e requer que o cliente fique sincronizado com o JMS Server. Também proporciona garantias de ordem nas mensagens. As mensagens não persistentes em memória devem ter maior prioridade.

Há 4 modos de funcionamento para que a sessão confirme a recepção da mensagem pelo consumidor:

- `AUTO_ACKNOWLEDGE`: a sessão reconhece automaticamente a recepção pois assume que a mensagem foi entregue após o consumer invocar a função receive(); 
- `DUPS_OK_ACKNOWLEDGE`: o provedor entrega uma mensagem sem enviar um reconhecimento ao servidor. É mais relaxada pois assume que o consumidor aceita mensagens duplicadas;
- `CLIENT_ACKNOWLEDGE`: a confirmação da entrega é da responsabilidade do cliente, o cliente deve chamar um método específico para que o servidor perceba. Implicitamente confirma também a recepção correcta de todas as mensagens anteriores;
- `SESSION_TRANSATED`: o cliente termina uma transaction e começa uma nova, garantindo um processo correcto de ponta a ponta. Estas transactions podem ser:

    - **Baseadas em sessões**: a incerteza de mensagens enviadas ainda pode ocorrer, por exemplo quando existir um erro na parte do commit;
    - **Distribuídas**: providenciam melhores garantias, mas ainda assim não evitam cenários de falha em determinados pontos;

### Non Persistent

Garante um comportamento at-most-once, pois a mensagem não precisa de sobreviver a um server crash mas espera-se que tolere falhas normais da network.

## Topic Subscription

