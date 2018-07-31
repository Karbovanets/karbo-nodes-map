const axios = require('axios');
//const CachemanFile = require('cacheman-file');
const CachemanMemory = require("cacheman-memory");

//const cache = new CachemanFile({tmpDir: '.cache', ttl: 24*3600,});
var cache = new CachemanMemory();
const cachettl = 24 * 3600;
const cachetll4nodes = 2 * 3600;
const port = 32348; 
const seednode = "95.46.98.64"; 
const freegeoserverUrl = "http://127.0.0.1:8080";
let mySet = new Set();
const clrcache =() => {
    cache.del("masterNodelocations");
    cache.del("locations");
}
const getLocation = async (ip, saveip) => new Promise((resolve) => {
    cache.get(ip, async (err, value) => {
        if (value) {
            if (!saveip) {
                return resolve(value.country_name);
            } else {
                return resolve(value);
            }
        }
        try {
            const res = await axios.get(`${freegeoserverUrl}/json/${ip}`);
            if (!saveip) {
                cache.set(ip, res.data, cachettl);
                resolve(res.data.country_name);

            } else {
                cache.set(ip, res.data, cachettl);
                resolve(res.data);
            }
        } catch (e) {
           // console.log('Can\'t get location', e);
        }
    });
});

 async function getPeerByIp  (ip) {
     mySet.add(ip);
    try {
        const res = await axios.get('http://' + ip + ':'+port+'/peers'); 
        if (!res.data.peers) throw new Error('Missing peers.');
        console.log(`${res.data.peers.length} peers found`);
        return res.data.peers;
    } catch (e) {
        //console.log('Can\'t get peers');
        return Promise.resolve([]);
	//Promise.reject(new Error("Can\'t get peers"));
    }
};
 async function getFeeByIp(ip) {
     
    try {
        const res = await axios.get('http://' + ip + ':'+port+'/feeaddress'); 
        if (!res.data.fee_address) throw new Error('Missing fee_address.');
        console.log(`${res.data.fee_address} fee_address found for ${ip}`);
        return ip;
    } catch (e) {
        //console.log('Can\'t get peers');
        return Promise.resolve("");
    //Promise.reject(new Error("Can\'t get peers"));
    }
};
const getAllpeers = async () => getPeerByIp(seednode).then((peers) => 
        
         Promise.all(peers.map(peer => {
            const [ip, ] = peer.split(':');
            if (mySet.has(ip)){
                return Promise.resolve([]);
            } else {
                return getPeerByIp(ip);
            }
        }).concat(Promise.resolve(peers)))
    );

const getMasterNodes = () => new Promise(resolve => {
    cache.get("masterNodelocations", (err, value) => {
        if (value){
            resolve(Promise.all(value.map(ip => getLocation(ip, true))));
        }else {
	  console.log("re new cashe");
          cacheLocations().then(()=>resolve(getMasterNodes()))
        }
  });
});

const cacheLocations = async () => {

    const l = await getAllpeers();
    const clearArray = l.reduce((a, b) => [...a, ...b]);

    console.log("clearArray: " + clearArray.length);
    const newclearArray = new Set(clearArray);
    const l2 = await  Promise.all(Array.from(newclearArray).map(peer => {
        const [ip, ] = peer.split(':');
        return getLocation(ip,false);

    }));
    const l3 = await  Promise.all(Array.from(newclearArray).map(peer => {
        const [ip, ] = peer.split(':');
        return getFeeByIp(ip);

    }));
    var counts = {};
    //cache.set("ips", Array.from(newclearArray), 3600);
    
    //console.log(l3.filter( item => item!=''));
    cache.set("masterNodelocations", l3.filter(item => item != ""), cachettl);
    
    l2.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    //console.log(counts.length);
    cache.set("locations", counts, cachetll4nodes);
    
    mySet = new Set();
	return counts;
};

const getLocations = () => new Promise((resolve) => {
    cache.get('locations', (err, value) => {
        if(value ){
            resolve(value ? value : []);
        } else {
	    console.log("re new cashe");
            resolve(cacheLocations());
        }
    });
});
module.exports = {
  cacheLocations,
  getLocations,
  getMasterNodes,
  clrcache
};
 //cacheLocations().then(result =>{ getMasterNodes().then( item => console.log(item)) })

