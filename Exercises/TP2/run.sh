rm *.o
gcc -o client.o client.c -I/opt/homebrew/include -L/opt/homebrew/lib -lzmq
gcc -o server.o server.c -I/opt/homebrew/include -L/opt/homebrew/lib -lzmq