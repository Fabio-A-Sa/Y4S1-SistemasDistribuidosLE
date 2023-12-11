#!/bin/bash

kill -9 $(lsof -ti :9000)
kill -9 $(lsof -ti :8000)

node proxy.js