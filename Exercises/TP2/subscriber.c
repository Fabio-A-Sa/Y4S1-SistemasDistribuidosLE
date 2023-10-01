#include "zhelpers.h"

int main (int argc, char *argv []) 
{
    if (argc != 3) {
        printf("Usage: ./subscriber <PT ZIP CODE> <EN ZIP CODE>\n");
        exit(0);
    }

    const char *filterPT = argv[1];
    const char *filterEN = argv[2];
    void *context = zmq_ctx_new ();

    //  Connect to PT weather server
    void *subscriberPT = zmq_socket (context, ZMQ_SUB);
    zmq_connect (subscriberPT, "tcp://localhost:5514");
    zmq_setsockopt (subscriberPT, ZMQ_SUBSCRIBE, filterPT, strlen(filterPT));

    //  Connect to EN weather server
    void *subscriberEN = zmq_socket (context, ZMQ_SUB);
    zmq_connect (subscriberEN, "tcp://localhost:5515");
    zmq_setsockopt (subscriberEN, ZMQ_SUBSCRIBE, filterEN, strlen(filterEN));

    zmq_pollitem_t items [] = {
        { subscriberPT, 0, ZMQ_POLLIN, 0 },
        { subscriberEN, 0, ZMQ_POLLIN, 0 }
    };

    //  Process messages from both sockets
    while (1) {

        char msg [256];
        zmq_poll (items, 2, -1);

        // PT
        if (items[0].revents & ZMQ_POLLIN) {
            int size = zmq_recv (subscriberPT, msg, 255, 0);
            if (size != -1) {
                printf("+");
            }
        }

        // EN
        if (items[1].revents & ZMQ_POLLIN) {
            int size = zmq_recv (subscriberEN, msg, 255, 0);
            if (size != -1) {
                printf("-");
            }
        }
    }

    zmq_close (subscriberPT);
    zmq_close (subscriberEN);
    zmq_ctx_destroy (context);
    return 0;
}