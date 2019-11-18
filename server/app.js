const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const handRouter = require('./routes/handRoute');

const app = express();
const path = require('path');
//app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.get('/', (req, res) => {
    res.send("It's Working!!")
})

app.use('/api/', handRouter)


app.listen(3000);
