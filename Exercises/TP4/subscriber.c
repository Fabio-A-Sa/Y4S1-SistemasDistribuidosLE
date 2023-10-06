#include "zhelpers.h"
#include <unistd.h>

int main (void) 
{
    void *context = zmq_ctx_new ();

    //  Socket to talk to clients
    void *responder = zmq_socket (context, ZMQ_SUB);
    int r = zmq_connect (responder, "tcp://localhost:6001");
    printf("Connection: %d\n", r);
    assert(r == 0);
    r = zmq_setsockopt(responder, ZMQ_SUBSCRIBE, "", 0);

    while (1) {

        //  Wait for next request from client
        char *string = s_recv (responder);
        printf ("Received message: [%s]\n", string);
        free (string);

        //  Send reply back to client
        s_send (responder, "ACK");
    }

    //  We never get here, but clean up anyhow
    zmq_close (responder);
    zmq_ctx_destroy (context);
    return 0;
}