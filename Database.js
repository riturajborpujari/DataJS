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
        if(error)   console.log(error);
    } );

    this.createTable = (tableName, schema) =>    {
        this.queryStr = "CREATE TABLE IF NOT EXISTS " + tableName + " (";

        for(let name in schema) {
            this.queryStr += name + " " + schema[name] + ",";
        }

        this.queryStr = this.queryStr.slice(0, -1);
        this.queryStr += ")";

        
        this.conn.query(this.queryStr, (err, result)=>  {
            if(err) console.log(err);
        });

        return this;
    }

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

    this.insert = (table, values)   =>   {
        this.queryStr = "INSERT INTO " + table + " VALUES(";
        let numValues = values.length;
        for(let i = 0; i < numValues; i++)  {
            this.queryStr += "'" + values[i] + "'";
            
            if(i != (numValues-1))  this.queryStr += ",";
        }
        this.queryStr += ");";

        return this;
    }

    this.update = (table)  => {
        this.queryStr = "UPDATE " + table + " ";
        return this;
    }

    this.set = (col, value) =>   {
        this.queryStr += " SET " + col + " = '" + value + "' ";
        return this; 
    }

    this.runQuery = (callback) => {
        this.conn.query(this.queryStr, (err, result, fields) => {
            callback(err, result, fields);
        } );

        return this;
    }
};
