var connection = require('./Database');
var process = require('process');
var config = require('./config.json');

var data = require('./data.json');

var conn = new connection(
    config.host, config.user,
    config.pass, config.db);


// if data is present in data.json... insert it into customers table
for( let i = 0; i < data.rows.length; i++)  {
    conn = conn.insert("customers", data.rows[i]).runQuery( (err, result)=>   {
        if(err) {
            console.log("Error: ", err);
        }
        else
        {
            console.log('Successfully inserted ', result.affectedRows, " rows");
        }
    });
}

// show all data
conn = conn.select("*").from("customers").limit(3).runQuery( (err, result, fields) => {
    if(err) console.log(err);
    else {

        for (let item of result)    {
            console.log(`Name\t: ${item.name} \t Addr\t: ${item.addr}`);
        }
    }
}) ;

//update a particular field
conn = conn.update("customers").set("addr", "Guwahati").where("addr='Assam'").runQuery( (err, result, fields)=>{
    if(err) console.log(err);
    else    {
        console.log('Update result: successfully updated ' ,result.changedRows, " rows.");
    }
})