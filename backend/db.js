const mongoose = require('mongoose');
// const url = 'mongodb://0.0.0.0:27017/tutorial';
const { MONGOURI } = require('./config/key')
mongoose.set('strictQuery', false);

const connecToMongoose = ()=>{
    mongoose.connect(url, ()=>{
        console.log('connected to mongo successfully!!');
    });
};

module.exports = connecToMongoose;