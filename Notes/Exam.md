# Exam

## Topics

- [Message Oriented Midleware](#message-oriented-midleware-mom);
- 
- 
- 
- 
- 
- 

## Message Oriented Midleware (MOM)

- Internet Protocol Stack: App (servers), Transport (processos), Network (computadores não diretamente ligados), Interface (computadores diretamente ligados);
- UPD por mensagens e TCP por streams. UDP pode ser unicast ou multicast. TPC não garante que não há perdas nem garante que é reenvio de pacotes provavelmente perdidos, devido aos processos não serem sempre indepotentes;
- Client stub faz parameter marshalling e response unmarshalling;
- Point-to-Point: Fila única, mensagem recebida só por um;
- Publish-Subscriber: Vários tópicos, mensagem recebida por todos os subscritores;
- JMS Persistent: once-and-only-once, store da mensagem nalgo não volátil. Pode ser implementado por sessões e com AUTO_ACKNOWLEDGE, DUPS_OK_ACKNOWLEDGE, CLIENT_ACKNOWLEDGE, SESSION_TRANSATED;
- JMS Non-Persistent: at-most-once;
- JMS Topics Subscription: unshared (only one consumer at a time), shared, non-durable (enquanto existir um consumer ativo), durable (existe até ser explicitamente eliminada);

