const CSVToJSON = require('csvtojson');
const FileSystem = require('fs');
const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://admin-eric:Django1988@cluster0.acztg.mongodb.net/testData?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// Create database and connect to mongodb use mongoose
mongoose.connect('mongodb://localhost:27017/cryptoCurrency', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create currency schema
const cryptoSchema = new mongoose.Schema({
   currency: String,
   date: Date,
   open: Number,
   high: Number,
   low: Number,
   close: Number,
   volume: Number,
   marketCap: Number
});

const Crypto = mongoose.model('Crypto', cryptoSchema);


function createDatabase() {
    CSVToJSON().fromFile(__dirname+'/crypto_historical_data.csv').then(function(dataSets){

            dataSets.forEach(function(dataSet) {
                const crypto = new Crypto({
                    currency: dataSet['Currency'],
                    date: dataSet['Date'],
                    open: parseFloat(dataSet['Open'].replaceAll(',','')),
                    high: parseFloat(dataSet['High'].replaceAll(',','')),
                    low: parseFloat(dataSet['Low'].replaceAll(',','')),
                    close: parseFloat(dataSet['Close'].replaceAll(',','')),
                    volume: parseInt(dataSet['Volume'].replaceAll(',','')),
                    marketCap: parseInt(dataSet['Market Cap'].replaceAll(',',''))
                });
                crypto.save();
            });
    });
};

Crypto.find(function(error, results){
    if (results.length === 0) {
        createDatabase();
        console.log('Insert Data successfully.');
    } else {
        console.log('Data already exists.');
    };
});
