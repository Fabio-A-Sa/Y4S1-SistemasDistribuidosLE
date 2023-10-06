#include "zhelpers.h"
#include <unistd.h>

int main (int argc, char *argv[]) 
{   
    if (argc != 2) {
        printf("Usage: ./subscriber <PORT>\n");
    }

    // Connection and port number
    char *port = argv[1];
    char connection[21];
    sprintf(connection, "tcp://localhost:%s", port);
    printf("Subscriber connecting to '%s'\n", connection);
    void *context = zmq_ctx_new ();

    // Socket to talk to proxy
    void *subscriber = zmq_socket (context, ZMQ_SUB);
    int r = zmq_connect (subscriber, connection);
    assert(r == 0);

    // Subscribe any string or topic
    zmq_setsockopt(subscriber, ZMQ_SUBSCRIBE, "", 0);

    while (1) {

        //  Wait for next request from client
        char *string = s_recv (subscriber);
        printf ("Received message:\n%s", string);
        free (string);
    }

    //  We never get here, but clean up anyhow
    zmq_close (subscriber);
    zmq_ctx_destroy (context);
    return 0;
}