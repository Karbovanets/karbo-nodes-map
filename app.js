const app = require('express')();
const locations = require('./locations');

locations.cacheLocations();
setInterval(locations.cacheLocations, 36e5); // 1hr

app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");

// blog home page
app.get('/', async (req, res) => {
    res.render('home', { locations: await locations.getCachedLocations() });
});


app.listen(8081);

console.log('listening on port 8081');