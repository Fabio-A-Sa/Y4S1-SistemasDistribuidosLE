kill -9 $(lsof -ti :$1)

node client.js $1