export MACOSX_DEPLOYMENT_TARGET=13.0
rm *.o
gcc -o publisherPT.o publisherPT.c -I/opt/homebrew/include -L/opt/homebrew/lib -lzmq
gcc -o publisherEN.o publisherEN.c -I/opt/homebrew/include -L/opt/homebrew/lib -lzmq
gcc -o subscriber.o subscriber.c -I/opt/homebrew/include -L/opt/homebrew/lib -lzmq