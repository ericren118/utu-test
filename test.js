const csv = require('csv-parser');
const fs = require('fs');
let results = [];

fs.createReadStream('crypto_historical_data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', ()=> {
        console.log('Finish reading');
        return results
    })





    app.post('/',function(req,res){
        const selectDate = req.body.dateList;

        connection.db.collection('cryptos', function(err, results){
            const theDate = req.body.dateList;
            results.find({date:{$eq: new Date(theDate)}}).toArray(function(err, newLists){
                console.log(newLists[0]);
            })

        })


    })
