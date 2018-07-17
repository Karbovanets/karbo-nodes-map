const axios = require('axios');
const CachemanFile = require('cacheman-file');

const cache = new CachemanFile({tmpDir: '.cache', ttl: 24*3600,});

const getPeers = async () => {
    try {
        const res = await axios.get('http://127.0.0.1:8197/peers');
        if (!res.data.peers) throw new Error('Missing peers.');
        console.log(`${res.data.peers.length} peers found`);
        return res.data.peers;
    } catch (e) {
        console.log('Can\'t get peers');
        throw e;
    }
};

const getLocation = async (ip) => new Promise((resolve) => {
    cache.get(ip, async (err, value) => {
        if (value) {
            return resolve(value);
        }
        try {
            const res = await axios.get(`http://127.0.0.1:8080/json/${ip}`);
            cache.set(ip, res.data, 24*3600);
            resolve(res.data);
        } catch (e) {
            console.log('Can\'t get location', e);
        }
    });
});

const getLocations = async () => {
    return getPeers().then(peers => Promise.all(peers.map(peer => {
        const [ip, ] = peer.split(':');
        return getLocation(ip);
    })));
};

const cacheLocations = async () => {
    const locations = await getLocations();
    cache.set('locations', JSON.stringify(locations), 100)
};

const getCachedLocations = () => new Promise((resolve) => {
    cache.get('locations', (err, value) => {
        resolve(value ? value : []);
    });
});

module.exports = {
    getCachedLocations,
    cacheLocations,
};
