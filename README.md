# Karbo nodes map

Visualizes KRB nodes and master nodes on the map.


## How to run
1. install freegeoip
```
cd ~
wget https://github.com/fiorix/freegeoip/releases/download/v3.4.1/freegeoip-3.4.1-linux-amd64.tar.gz
tar -xvfz freegeoip-3.4.1-linux-amd64.tar.gz
cd freegeoip-3.4.1-linux-amd64
chmod +x freegeoip
```

2. Download maxmind database (auto-download kinda deprecated, more details [here](https://blog.maxmind.com/2019/12/18/significant-changes-to-accessing-and-using-geolite2-databases/)) and convert it from tar.gz to .gz
3. Run freegeoip
```
./freegeoip --cors-origin "<SITE>" --quota-max 0 --db <db path>
```
4. Install dependencies and run the map
```
npm i
sudo node app.js--startnode=[hostname] --interval=[num] [[--port=[num]], --freegeoserverUrl=[hostname:port]]
```

**Important**: intervals less than 3600 are not recommended.

Open http://localhost:8081.

Caching interval for node list is hardcoded for 24 hour.

![image](https://user-images.githubusercontent.com/3770296/43669800-83a4441a-978e-11e8-8966-b92856e8adf8.png)

