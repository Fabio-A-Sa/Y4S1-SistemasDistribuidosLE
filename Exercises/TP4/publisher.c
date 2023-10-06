#include "zhelpers.h"
#include <stdio.h>
#include <stdlib.h>

int main (void) 
{
    void *context = zmq_ctx_new ();

    //  Socket to talk to server
    void *requester = zmq_socket (context, ZMQ_PUB);
    int r = zmq_connect (requester, "tcp://localhost:6000");
    printf("Connection: %d\n", r);
    assert(r == 0);

    while (1) {

        // Send input
        char *input = NULL;
        size_t input_size = 0;
        ssize_t read = getline(&input, &input_size, stdin);
        s_send (requester, input);
        free (input);

        // Receive ACK
        char *string = s_recv (requester);
        printf ("Received [%s]\n", string);
        free (string);
    }

    zmq_close (requester);
    zmq_ctx_destroy (context);
    return 0;
}