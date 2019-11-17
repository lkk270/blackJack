const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const handRouter = require('./routes/handRoute');

const app = express();
const path = require('path');
//app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
    res.send("It's Working!!")
})

app.use('/api/', handRouter)


app.listen(3000);
