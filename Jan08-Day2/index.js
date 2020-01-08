const express = require('express');
const app = express();

app.use('/site', express.static('public'));

app.listen(8000, function() {
    console.log("Running on port 8000");
})