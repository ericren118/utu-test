const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();
const CSVToJSON = require('csvtojson');
const FileSystem = require('fs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/', router);

// Create database and connect to mongodb use mongoose
mongoose.connect('mongodb+srv://admin-eric:Django1988@cluster0.acztg.mongodb.net/cryptoDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create database and connect to mongodb use mongoose
// mongoose.connect('mongodb://localhost:27017/cryptoCurrency', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

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


//  Set a default date for home page to render
var defaultDate = new Date('2019-12-03T14:00:00.000Z')

//  Use defaultDate(User selected date) to generate the date for past 1 day, past 7 days, past 30 days.
function addDay(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}



//  load home page
app.get('/', function(req, res){

    var down1Day = addDay(defaultDate, -1);
    var down7Day = addDay(defaultDate,-7);
    var down30Day = addDay(defaultDate,-30);

    Crypto.find({date:{$in: new Date(defaultDate)}}).sort({marketCap:-1, date: -1}).exec((err, dayList) => {
        if (err) {
            console.log(err);
        } else {
            Crypto.distinct('date').exec((err, dateList) => {
                if (!err) {
                    Crypto.find({date: {$eq: new Date(down1Day)}}).sort({marketCap: -1}).exec((err, down1) => {
                        if (!err) {

                            Crypto.find({date: {$eq: new Date(down7Day)}}).sort({marketCap: -1}).exec((err, down7) => {
                                if (!err) {

                                    Crypto.find({date: {$eq: new Date(down30Day)}}).sort({marketCap: -1}).exec((err, down30) => {
                                        if (!err) {

                                            res.render('index', {dayList:dayList, dateList:dateList.reverse(), chosenDate:defaultDate, down1:down1, down7:down7, down30:down30})
                                        }
                                    })

                                }
                            })

                        }
                    })



                }

            });

        };
    });

});

app.post('/',function(req,res){
    defaultDate = req.body.dateList;
    res.redirect('/')

})



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
    console.log('Server has started successfully!');
});
