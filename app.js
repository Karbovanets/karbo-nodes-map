const express = require('express');
const app = express();
const locations = require("./getallpeers.js");

const argv = require("yargs")
  .default("port", 32348)
  .default("freegeoserverUrl", "127.0.0.1:8080")
  .usage("Usage: $0 --startnode=[str] --interval=[num] [[ --port=[num]], --freegeoserverUrl=[str]]")
    .help('h')
    .alias('h', 'help').argv;
let   interval =3600;//sec

app.set("views", __dirname + "/views");
app.use(express.static(__dirname + '/vendor'));
// blog home page
app.get('/clrcache',  (req, res) => {
    locations.clrcache();
    res.send("clrcache");
});
app.get('/locations', async (req, res) => {
    res.send(await locations.getLocations());
});
app.get('/getmastenodes', async (req, res) => {

    res.send(await locations.getMasterNodes(argv.freegeoserverUrl));
});
if (!argv.startnode) {
    console.log("set --startnode=<node>");
    return;
}
if (!argv.interval) {
    console.log("interval set to default: " + interval);
    
} else {
    if (argv.interval > interval) interval = argv.interval;
}

locations.cacheLocations(argv.startnode, argv.port, argv.freegeoserverUrl);

app.listen(8081);
console.log("interval set to : " + interval+" s.");
setInterval(locations.cacheLocations, interval * 1000, argv.startnode, argv.port);
console.log('listening on port 8081');