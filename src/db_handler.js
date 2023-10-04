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
exports.getFlag = function (flag){

    var db = new sqlite3.Database('database/liberty-flag.sqlite');
    var result = {};

    db.all("SELECT * FROM flags WHERE flag_name=?",flag, function(err,rows){
        rows.forEach(function (row) {
            result = {
                flag_name: row.flag_name,
                flag_value: row.flag_value
            };            
        });
    });

    db.close();
    return result;

}