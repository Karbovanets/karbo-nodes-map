# Karbo nodes map

Visualizes KRB nodes and master nodes on the map.


## How to run
install and run freegeoip
```
cd ~
wget https://github.com/fiorix/freegeoip/releases/download/v3.4.1/freegeoip-3.4.1-linux-amd64.tar.gz
tar xvfz freegeoip-3.4.1-linux-amd64.tar.gz
cd freegeoip-3.4.1-linux-amd64
chmod +x freegeoip
./freegeoip --cors-origin "<SITE>" --quota-max 0
```
and run
`npm i`
`sudo node app.js--startnode=[hostname] --interval=[num] [[--port=[num]], --freegeoserverUrl=[hostname:port]]`

interval must more than 3600

Open localhost:8081.

It's caching nodes' ips every 24 hrs into memory 
![image](https://user-images.githubusercontent.com/3770296/43669800-83a4441a-978e-11e8-8966-b92856e8adf8.png)

