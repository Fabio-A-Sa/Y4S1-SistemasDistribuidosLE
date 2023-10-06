export MACOSX_DEPLOYMENT_TARGET=13.0
rm *.o
gcc -o proxy.o proxy.c -I/opt/homebrew/include -L/opt/homebrew/lib -lzmq
gcc -o subscriber.o subscriber.c -I/opt/homebrew/include -L/opt/homebrew/lib -lzmq
gcc -o publisher.o publisher.c -I/opt/homebrew/include -L/opt/homebrew/lib -lzmq