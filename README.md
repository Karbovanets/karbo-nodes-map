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
`sudo node app.js--startnode=[hostname] --interval=[num] [[ --port=[num]], --freegeoserverUrl=[hostname:port]]`
interval must more than 3600 
Open localhost:8081.

It's caching nodes' ips every 24 hrs into memory 

![image](https://user-images.githubusercontent.com/3770296/43407301-0869e3dc-9427-11e8-91f5-641fce4aa510.png)
