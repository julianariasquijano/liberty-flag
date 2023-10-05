const db = require('better-sqlite3')('database/liberty-flag.sqlite');

const getFlags = function (){
    var list = [];
    const rows = db.prepare('SELECT * FROM flags').all();
    rows.forEach(function (row) {
        list.push({
            name: row.flag_name,
            value: row.flag_value
        });
    });
    return list;
}
exports.getFlags = getFlags

const getFlag = function (flag){

    var result = {};

    const row = db.prepare("SELECT * FROM flags WHERE flag_name=?").get(flag)
    result = {
        name: row.flag_name,
        value: row.flag_value
    };            
    return result;

}
exports.getFlag = getFlag

const saveFlag = function (data){
    db.prepare("UPDATE flags SET flag_value = ? WHERE flag_name=?").run(data["flag-value"],data["flag-name"]) 
    return getFlag(data["flag-name"])
}
exports.saveFlag = saveFlag


