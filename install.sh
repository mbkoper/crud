#!/bin/bash

apt update -y && apt upgrade -y
apt -y install curl
curl -sL https://deb.nodesource.com/setup_14.x | bash -
apt -y install nodejs git
git clone https://github.com/mbkoper/crud.git
cd crud
npm install
node ./server.js > server.log&

