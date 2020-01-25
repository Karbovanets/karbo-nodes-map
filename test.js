var fs = require('fs');
 
var contents = fs.readFileSync('test', 'utf8');

var mas = contents.split(",");
console.log(mas.length);

var s = new Set(mas);
console.log(s.size);