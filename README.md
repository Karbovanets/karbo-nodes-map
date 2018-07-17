# Qwertycoin nodes map

Visualizes Qwertycoin nodes on the map.

## What you need
You need a running Qwertycoind on the same system on Port 8197 or change line 8
in location.js

## How to run
install and run freegeoip
```
cd ~
wget https://github.com/fiorix/freegeoip/releases/download/v3.2/freegeoip-3.2-linux-amd64.tar.gz
tar xvfz freegeoip-3.2-linux-amd64.tar.gz
cd freegeoip-3.2-linux-amd64
chmod +x freegeoip
./freegeoip --quota-max 0
```
and run
`npm i`
`sudo node app.js`
Open localhost:9090.

It's caching nodes' ips every 24 hrs into `.cache` folder.

![Map](https://qwertycoin.org/wp-content/uploads/2018/03/qwcnodesogimage.png)
		
