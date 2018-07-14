# Karbo nodes map

Visualizes KRB nodes on the map.

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
Open localhost:8081.

It's caching nodes' ips every 24 hrs into `.cache` folder.

![Map](https://image.prntscr.com/image/l4VjtIIjS6mK3w40HogBGQ.png)
