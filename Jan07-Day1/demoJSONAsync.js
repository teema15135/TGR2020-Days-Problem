const fs = require('fs');

const rawdata = fs.readFileSync('./myProfile.json');

fs.readFile('./myProfile.json', (err, data) => {
    console.log('Read', data);
});

var jsondata = JSON.parse(rawdata);

console.log(typeof(jsondata), jsondata);

jsondata.Salary.forEach(element => {
    console.log(element);
});