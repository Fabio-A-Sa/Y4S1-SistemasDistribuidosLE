# SDLE Project

## Documentation

- [Architecture](./docs/Architecture.pdf)
- [Code](/src/)
- [Database](./database/)
- [Presentation](./docs/Presentation.pdf)
- [Demonstration](./docs/Demo.mp4)

## How to Run:

- This will install all the dependencies listed in package.json.
    - ``npm install``
- Run Proxy & Servers
    - ``cd src``
    - ``npm run cloud`` (this command will start the Proxy and a static number of Servers described in [config file](./src/config.json))
- Run Client
    - ``cd src``
    - ``npm run client PORT`` - (e.g. npm run client 5500)
        - SERVER PORTS ARE STATIC! DO NOT USE THEM! (check [config file](./src/config.json))
- Simulate Server disconnection
    - ``kill pid`` (pid is defined for each server when you start the cloud, check the console)

## Members

- André Costa, up201905916@up.pt
- Bárbara Carvalho, up202004695@up.pt
- Fábio Sá, up202007658@up.pt
- Luís Cabral, up202006464@up.pt

#### T05, SDLE 2023/24