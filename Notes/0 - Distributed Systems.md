# Distributed Systems

Um sistema distribuído consiste num conjunto de processos que comunicam entre si através de mensagens atómicas e em que o roundtrip não é desprezável. <br>
As propriedades do canal de comunicação dependem do protocolo de transporte usado:

- `UDP`: por mensagem, não é connection-based, permite perdas e duplicados, não entrega em ordem e não tem flow control; 
- `TCP`: por streams, é connection-based, evita perdas e duplicados, entrega em ordem e tem flow control;

### TCP

O que `TCP` garante é que a aplicação será notificada se não existir forma de entregar o pacote ao destino. `send()/write()` enviarão um erro. Portanto, TCP não garante que não haverá perdas nem retransmite essa informação ou informação que foi perdida noutras conexões.

TCP nem sempre retransmite mensagens que podem não ter sido entregues porque assim garante segurança nas operações **indepotentes** (como operação de débito ou compra). Operações indepotentes são aquelas que não alteram o estado normal do servidor quando são repetidas várias vezes (como uma operação de GET de uma página web).

### RCP

Remote Procedure Call serve para termos uma interface com servidores remotos:

- `Client Stub`: faz um *parameter marshalling* e bloqueia pela resposta se o RPC não for assíncrono. Depois faz *unmarshalling* da resposta;
- `Server Stub`: determina os argumentos recebidos (*unmarshalling*) e chama a sua função interna. Depois envia o retorno pelo mesmo canal de comunicação;