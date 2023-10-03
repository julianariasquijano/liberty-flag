var sqlite3 = require("sqlite3");
exports.getFlags = function (){
    var list = [];
    var db = new sqlite3.Database('database/liberty-flag.sqlite');

    db.all("SELECT * FROM flags", function(err,rows){
        rows.forEach(function (row) {
            list.push({
                meta_name: row.flag_name,
                meta_value: row.flag_value
            });
        });
    });

    db.close();
    return list;
}