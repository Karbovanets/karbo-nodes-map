const express = require('express');
const app = express();
const locations = require("./getallpeers.js");


app.set('view engine', 'ejs');
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

    res.send(await locations.getMasterNodes());
});

locations.getLocations();

app.listen(8081);

console.log('listening on port 8081');