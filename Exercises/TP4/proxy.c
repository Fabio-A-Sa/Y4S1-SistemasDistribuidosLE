#include "zhelpers.h"

int main (int argc, char *argv[])
{
    if (argc != 3) {
        printf("Usage: ./proxy <PUBLISHER_PORT> <SUBSCRIBER_PORT>\n");
    }

    // Publishers connection
    char *port_publisher = argv[1];
    char connection_publisher[21];
    sprintf(connection_publisher, "tcp://*:%s", port_publisher);
    printf("Publishers at '%s'\n", connection_publisher);

    // Subscriber connection
    char *port_subscriber = argv[2];
    char connection_subscriber[21];
    sprintf(connection_subscriber, "tcp://*:%s", port_subscriber);
    printf("Subscribers at '%s'\n", connection_subscriber);

    // Context
    void *context = zmq_ctx_new ();

    // Backend - publishers
    void *backend = zmq_socket (context, ZMQ_XPUB);
    int r = zmq_bind (backend, connection_publisher);
    assert(r == 0);

    // Frontend - subscribers
    void *frontend = zmq_socket (context, ZMQ_XSUB);
    r = zmq_bind (frontend, connection_subscriber);
    assert(r == 0);

    //  Run the proxy until the user interrupts us
    zmq_proxy (backend, frontend, NULL);
    
    zmq_close (frontend);
    zmq_close (backend);
    zmq_ctx_destroy (context);
    return 0;
}