const fs = require('fs');

const rawdata = fs.readFileSync('./myProfile.json');

var jsondata = JSON.parse(rawdata);

console.log(typeof(jsondata), jsondata);

jsondata.Salary.forEach(element => {
    console.log(element);
});