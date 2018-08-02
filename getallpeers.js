const axios = require("axios");
//const CachemanFile = require('cacheman-file');
const CachemanMemory = require("cacheman-memory");

//const cache = new CachemanFile({tmpDir: '.cache', ttl: 24*3600,});
const cache = new CachemanMemory();
const cachettl = 24 * 3600;
const cachetll4nodes = 24 * 3600;

let mySet = new Set();
let failCount = 0;
const clrcache = () => {
  cache.del("masterNodelocations");
  cache.del("locations");
};

const getLocation = async (ip, saveip, freegeoserverUrl) =>
  new Promise(resolve => {
    cache.get(ip, async (err, value) => {
      if (value) {
        if (!saveip) {
          return resolve(value.country_name);
        } else {
          return resolve(value);
        }
      }
      try {
        const res = await axios.get(`http://${freegeoserverUrl}/json/${ip}`);
        if (!saveip) {
          cache.set(ip, res.data, cachettl);
          resolve(res.data.country_name);
        } else {
          cache.set(ip, res.data, cachettl);
          resolve(res.data);
        }
      } catch (e) {
        console.log(
          "Can't get location failCount:" +
            failCount++ +
            " url: " +
            freegeoserverUrl +
            " " +
            e.message
        );
        if (failCount < 1000) {
          getLocation(ip, saveip, freegeoserverUrl);
        } else {
          resolve("-");
        }
      }
    });
  });

async function getPeerByIp(ip, port) {
  mySet.add(ip);
  try {
    const res = await axios.get("http://" + ip + ":" + port + "/peers");
    if (!res.data.peers) throw new Error("Missing peers.");
    // console.log(`${res.data.peers.length} peers found`);
    return res.data.peers;
  } catch (e) {
    //console.log('Can\'t get peers');
    return Promise.resolve([]);
    //Promise.reject(new Error("Can\'t get peers"));
  }
}
async function getFeeByIp(ip, port) {
  try {
    const res = await axios.get("http://" + ip + ":" + port + "/feeaddress");
    if (!res.data.fee_address) throw new Error("Missing fee_address.");
    //console.log(`${res.data.fee_address} fee_address found for ${ip}`);
    return ip;
  } catch (e) {
    //console.log('Can\'t get peers');
    return Promise.resolve("");
    //Promise.reject(new Error("Can\'t get peers"));
  }
}
const getAllpeers = async (startnode, port) =>
  getPeerByIp(startnode, port).then(peers =>
    Promise.all(
      peers
        .map(peer => {
          const [ip] = peer.split(":");
          if (mySet.has(ip)) {
            return Promise.resolve([]);
          } else {
            return getPeerByIp(ip, port);
          }
        })
        .concat(Promise.resolve(peers))
    )
  );

const getMasterNodes = freegeoserverUrl =>
  new Promise(resolve => {
    cache.get("masterNodelocations", (err, value) => {
      if (value) {
        resolve(
          Promise.all(value.map(ip => getLocation(ip, true, freegeoserverUrl)))
        );
      } else {
        console.log("re new cashe");
        //cacheLocations().then(()=>resolve(getMasterNodes()))
        resolve([]);
      }
    });
  });

const cacheLocations = async (startnode, port, freegeoserverUrl) => {
  console.log(`run cacheLocations: startnode = ${startnode}:${port}`);
  console.time("getAllpeers");
  const l = await getAllpeers(startnode, port);
  const clearArray = l.reduce((a, b) => [...a, ...b]);

  const newclearArray = new Set(clearArray);
  console.log(" getAllpeers size: " + newclearArray.size);
  console.timeEnd("getAllpeers");
  console.time("getLocation");
  const l2 = await Promise.all(
    Array.from(newclearArray).map(peer => {
      const [ip] = peer.split(":");
      return getLocation(ip, false, freegeoserverUrl);
    })
  );
  console.log(" get all peers location ");
  console.timeEnd("getLocation");
  console.time("get master nodes");
  const l3 = await Promise.all(
    Array.from(newclearArray).map(peer => {
      const [ip] = peer.split(":");
      return getFeeByIp(ip, port);
    })
  );
  console.log(" get master nodes ");
  console.timeEnd("get master nodes");
  let counts = {};
  //cache.set("ips", Array.from(newclearArray), 3600);

  //console.log(l3.filter( item => item!=''));
  cache.set("masterNodelocations", l3.filter(item => item != ""), cachettl);

  l2.forEach(function(x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  //console.log(counts.length);
  cache.set("locations", counts, cachetll4nodes);

  mySet = new Set();
  failCount = 0;
  return counts;
};

const getLocations = () =>
  new Promise(resolve => {
    //console.log("--== run locations ==--");
    cache.get("locations", (err, value) => {
      console.log("--== run locations ==--");
      if (value) {
        resolve(value ? value : []);
      } else {
        //console.log("need renew cashe");
        resolve([]);
        //resolve(cacheLocations());
      }
    });
  });
module.exports = {
  cacheLocations,
  getLocations,
  getMasterNodes,
  clrcache
};
