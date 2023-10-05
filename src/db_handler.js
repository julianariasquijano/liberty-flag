const db = require('better-sqlite3')('database/liberty-flag.sqlite');

const createFlag = function (data){
    db.prepare("INSERT INTO flags (flag_name,flag_value) VALUES (?,?)").run(data["flag-name"],data["flag-value"])
    return getFlag(data["flag-name"])
}
exports.createFlag = createFlag

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

const updateFlag = function (data){
    db.prepare("UPDATE flags SET flag_value = ? WHERE flag_name=?").run(data["flag-value"],data["flag-name"]) 
    return getFlag(data["flag-name"])
}
exports.updateFlag = updateFlag


