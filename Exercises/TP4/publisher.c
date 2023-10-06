#include "zhelpers.h"
#include <stdio.h>
#include <stdlib.h>

int main (int argc, char *argv[]) 
{
    if (argc != 2) {
        printf("Usage: ./publisher <PORT>\n");
    }

    // Connection and port number
    char *port = argv[1];
    char connection[21];
    sprintf(connection, "tcp://localhost:%s", port);
    printf("Publisher connecting to '%s'\n", connection);
    void *context = zmq_ctx_new ();

    //  Socket to talk to proxy
    void *publisher = zmq_socket (context, ZMQ_PUB);
    int r = zmq_connect (publisher, connection);
    assert(r == 0);

    while (1) {

        // Send input
        char *input = NULL;
        size_t input_size = 0;
        ssize_t read = getline(&input, &input_size, stdin);
        s_send (publisher, input);
        free (input);
    }

    zmq_close (publisher);
    zmq_ctx_destroy (context);
    return 0;
}