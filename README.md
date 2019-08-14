# Booking
Module that renders a calendar and keeps track of property availability

Installation on AWS ubuntu instance:


Download codebase:

git clone https://github.com/grantdiamond/Booking

Install NPM:

sudo apt install npm

Install redis:

cd back to main directory, then:

mkdir redis && cd redis
curl -O http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
sudo apt update
sudo apt upgrade
sudo apt install build-essential
sudo apt-get install tcl8.5
make
make test

from within the redis-stable directory:

sudo make install

Run redis:

redis-server

or, from within Booking directory:

npm run redis

npm install -g npx

