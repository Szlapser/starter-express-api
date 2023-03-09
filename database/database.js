const path = require('path')
require('dotenv').config({path:  path.resolve(__dirname,'../.env')})

const mongoose = require('mongoose');
module.exports = mongoose.connect(process.env.MONGO_DB_URI)
