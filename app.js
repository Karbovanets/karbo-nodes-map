const app = require('express')();
const locations = require('./locations');

locations.cacheLocations();
setInterval(locations.cacheLocations, 60000); // 1hr

app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");

// blog home page
app.get('/', async (req, res) => {
    res.render('home', { locations: await locations.getCachedLocations() });
});

app.listen(9090);

console.log('listening on port 9090');
