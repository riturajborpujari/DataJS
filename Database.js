var mysql = require('mysql');
var events = require('events');
var emitter = new events.EventEmitter();


module.exports = function createConn(_host, _user, _pass, _db)   {
    
    this.conn = mysql.createConnection({
    host    : _host,
    user    : _user,
    password: _pass,
    database: _db
    });

    this.conn.connect((error) =>{
        if(error)   console.log('Database: Couldnot connect');
        else    console.log("Database: connected.");
    } );

    this.select = (columns) =>   {
        this.queryStr = "SELECT ";
        this.queryStr += columns;
        return this;
    };

    this.from = (table) => {
        this.queryStr += ` FROM ${table} `;
        return this;
    }

    this.where = (condition) => {
        this.queryStr += `WHERE ${condition} `;
        return this;
    }

    this.limit = (limit)    =>  {
        this.queryStr += "LIMIT " + limit;
        return this;
    }

    this.getData = (callback) => {    
        this.queryStr += ";";

        this.conn.query( this.queryStr, (err, result, fields) =>    {
            if(err) console.log("Database read failed.");
            this.err = err;
            this.result = result;
            this.fields = fields;
            
            callback(this.err, this.result, this.fields);
        });
        return this;
    }

    this.insert = (table, values, callback)   =>   {
        this.queryStr = "INSERT INTO " + table + " VALUES(";
        let numValues = values.length;
        for(let i = 0; i < numValues; i++)  {
            this.queryStr += "'" + values[i] + "'";
            
            if(i != (numValues-1))  this.queryStr += ",";
        }
        this.queryStr += ");";

        this.conn.query(this.queryStr, (err, result) =>        {
            callback(err, result);
        });

        return this;
    }
};
