const connecToMongoose = require('./db');
const express = require('express');
var cors = require('cors');

const app = express();
connecToMongoose();

app.use(express.json());
app.use(cors());
//Available Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/notes', require('./routes/notes.js'));

app.listen(5000, ()=>{
    console.log('listening at port 5000');
})
