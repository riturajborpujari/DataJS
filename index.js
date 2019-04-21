var connection = require('./Database');
var process = require('process');
var config = require('./config.json');

var data = require('./data.json');

try {

    var conn = new connection(
        config.host, config.user,
        config.pass, config.db);
}
catch (error)   {
    console.log("Error: ", error.message);
}



// if data is present in data.json... insert it into customers table
for( let i = 0; i < data.rows.length; i++)  {
    conn = conn.insert("customers", data.rows[i], (err, result)=>   {
        if(err) {
            console.log("Error: ", err);
        }
        else
        {
            console.log('Successfully inserted ', result.affectedRows, " rows");
        }
    });
}

conn = conn.select("*").from("customers").limit(3).getData( (err, result, fields) => {
    if(err) console.log(err);
    else {
        process.nextTick( ()=>{ //runs after the for loop
            process.exit(0);
        })

        for (let item of result)    {
            console.log(`Name\t: ${item.name} \t Addr\t: ${item.addr}`);
        }
    }
}) ;