const mongoose = require('mongoose');
const mongouri = "mongodb+srv://Raghav:BMU220418@cluster0.je7nwju.mongodb.net/"
const connecttomongo = () => {
    mongoose.connect(mongouri)
}
module.exports = connecttomongo;