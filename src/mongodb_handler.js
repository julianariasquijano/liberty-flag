const { env } = require('node:process');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoUri = `mongodb+srv://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const createFlag = async function (data){

    await client.connect();
    db = client.db("liberty-flag");

    await db.collection('flags').insertOne({
        flag_name: data["flag-name"],
        flag_value: data["flag-value"]
    })

    await client.close()
    return await getFlag(data["flag-name"])
}
exports.createFlag = createFlag

const getFlags = async function (){
    var list = [];
    let document = {}

    try {
      await client.connect();
      db = client.db("liberty-flag");    
      const cursor = await db.collection('flags').find({});
  
  
      while (await cursor.hasNext()) {
          document = await cursor.next();
          list.push({
              name: document.flag_name,
              value: document.flag_value
          });       
      }
    } catch (error) {
      
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }

    return list;
}
exports.getFlags = getFlags

const getFlag = async function (flagName){

    var result = {};

    await client.connect();
    db = client.db("liberty-flag");    
    const cursor = await db.collection('flags').find({ flag_name: flagName });

    let document = {}
    while (await cursor.hasNext()) {
        document = await cursor.next();
        result = {
            name: document.flag_name,
            value: document.flag_value
        };          
    }    
      
    await client.close()
    return result;

}
exports.getFlag = getFlag

const updateFlag = async function (data){
    await client.connect();
    db = client.db("liberty-flag")
    const flags = db.collection("flags");   
    const result = await flags.replaceOne({ 
      flag_name: data["flag-name"] }, //filter
      { //document
        flag_name: data["flag-name"],
        flag_value: data["flag-value"]
      }, 
      {upsert: false} //options
    )
    return await getFlag(data["flag-name"])
}
exports.updateFlag = updateFlag

const deleteFlag = async function (flagName){

    await client.connect();
    db = client.db("liberty-flag")
    const flags = db.collection("flags");   
    const result = await flags.deleteOne({ flag_name: flagName })
    return await getFlag(flagName)

}
exports.deleteFlag = deleteFlag
