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

  let bucket = await getBucket(data["bucket_name"])

  await client.connect();
  db = client.db("liberty-flag");

    await db.collection('flags').insertOne({
        flag_name: data["flag-name"],
        flag_type: data["flag-type"],
        flag_options: data["flag-options"],
        flag_values: [],
        flag_tags: [],
        bucket_id: bucket._id.toString()
      })

    await client.close()
    return await getFlag(data["flag-name"])
}
exports.createFlag = createFlag

const getFlags = async function (bucketName){
    var list = [];
    let document = {}

    let bucket = await getBucket(bucketName)

    try {
      await client.connect();
      db = client.db("liberty-flag");    
      const cursor = await db.collection('flags').find({bucket_id:bucket._id.toString()}); 
  
      while (await cursor.hasNext()) {
          document = await cursor.next();
          list.push({
              bucket_id: document.bucket_id,
              name: document.flag_name,
              type: document.flag_type
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
            bucket_id: document.bucket_id,
            name: document.flag_name,
            type: document.flag_type,
            options: document.flag_options,
            values: document.flag_values,
            tags: document.flag_tags
        };          
    }    
      
    await client.close()
    return result;

}
exports.getFlag = getFlag

const updateFlag = async function (data){
    let flag = await getFlag(data["flag-name"])
    await client.connect();
    db = client.db("liberty-flag")
    const flags = db.collection("flags");   
    const result = await flags.replaceOne({ 
      flag_name: data["flag-name"] }, //filter
      { //document
        bucket_id: flag.bucket_id,
        flag_name: data["flag-name"],
        flag_type: data["flag-type"],
        flag_values: JSON.parse(data["flag-values"]),
        flag_tags: JSON.parse(data["flag-tags"]),
        flag_options: data["flag-options"]

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

const createBucket = async function (data){

  await client.connect();
  db = client.db("liberty-flag");

  await db.collection('buckets').insertOne({
      bucket_name: data["bucket-name"],
      bucket_contexts: []
  })

  await client.close()
  return await getBucket(data["bucket-name"])
}
exports.createBucket = createBucket

const getBuckets = async function (){
  var list = [];
  let document = {}

  try {
    await client.connect();
    db = client.db("liberty-flag");    
    const cursor = await db.collection('buckets').find({});


    while (await cursor.hasNext()) {
        document = await cursor.next();
        list.push({
            name: document.bucket_name
        });       
    }
  } catch (error) {
    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return list;
}
exports.getBuckets = getBuckets

const getBucket = async function (bucketName){

  var result = {};

  await client.connect();
  db = client.db("liberty-flag");    
  const cursor = await db.collection('buckets').find({ bucket_name: bucketName });

  let document = {}
  while (await cursor.hasNext()) {
      document = await cursor.next();
      result = {
          _id: document._id,
          name: document.bucket_name,
          contexts: document.bucket_contexts
      };          
  }    
    
  await client.close()
  return result;

}
exports.getBucket = getBucket

const updateBucket = async function (data){
  await client.connect();
  db = client.db("liberty-flag")
  const buckets = db.collection("buckets");   
  const result = await buckets.replaceOne({ 
    bucket_name: data["bucket-name"] }, //filter
    { //document
      bucket_name: data["bucket-name"],
      bucket_contexts: JSON.parse(data["bucket-contexts"])
    }, 
    {upsert: false} //options
  )
  return await getBucket(data["bucket-name"])
}
exports.updateBucket = updateBucket

const deleteBucket = async function (bucketName){

  await client.connect();
  db = client.db("liberty-flag")
  const buckets = db.collection("buckets");   
  const result = await buckets.deleteOne({ bucket_name: bucketName })
  return await getBucket(bucketName)

}
exports.deleteBucket = deleteBucket

const createTag = async function (data){

  await client.connect();
  db = client.db("liberty-flag");

  await db.collection('tags').insertOne({
      tag_name: data["tag-name"]
  })

  await client.close()
  return await getTag(data["tag-name"])
}
exports.createTag = createTag

const getTags = async function (){
  var list = [];
  let document = {}

  try {
    await client.connect();
    db = client.db("liberty-flag");    
    const cursor = await db.collection('tags').find({});


    while (await cursor.hasNext()) {
        document = await cursor.next();
        list.push({
            name: document.tag_name
        });       
    }
  } catch (error) {
    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return list;
}
exports.getTags = getTags

const getTag = async function (tagName){

  var result = {};

  await client.connect();
  db = client.db("liberty-flag");    
  const cursor = await db.collection('tags').find({ tag_name: tagName });

  let document = {}
  while (await cursor.hasNext()) {
      document = await cursor.next();
      result = {
          name: document.tag_name
      };          
  }    
    
  await client.close()
  return result;

}
exports.getTag = getTag

const updateTag = async function (data){
  await client.connect();
  db = client.db("liberty-flag")
  const tags = db.collection("tags");   
  const result = await tags.replaceOne({ 
    bucket_name: data["tag-name"] }, //filter
    { //document
      tag_name: data["tag-name"]
    }, 
    {upsert: false} //options
  )
  return await getTag(data["tag-name"])
}
exports.updateTag = updateTag

const deleteTag = async function (tagName){

  await client.connect();
  db = client.db("liberty-flag")
  const tags = db.collection("tags");   
  const result = await tags.deleteOne({ tag_name: tagName })
  return await getTag(tagName)

}
exports.deleteTag = deleteTag

const getFlagsValues = async function (contextKey){
  let flags = []
  await client.connect();
  db = client.db("liberty-flag");    
  const cursor = await db.collection('flags').find({ "flag_values.id": contextKey });
  
  let document = {}
  while (await cursor.hasNext()) {
    document = await cursor.next();
    var flag = {};
    for (let contextIndex = 0; contextIndex < document.flag_values.length; contextIndex++) {
      flagValue = document.flag_values[contextIndex];
      if (flagValue.id == contextKey) {
        flag = {
          name: document.flag_name,
          value: flagValue.value
        };
        break              
      }
    }
    flags.push(flag)
  }    
    
  await client.close()
  return flags;

}
exports.getFlagsValues = getFlagsValues