module.exports = function(viewVars,db) {

  'use strict';

  const { koaBody } = require('koa-body');
  const Router = require('@koa/router');
  const router = new Router();

  router.get('/buckets', async (ctx) => {

    viewVars.buckets = await db.getBuckets()
    viewVars.messages = []
    return ctx.render('buckets/buckets', viewVars);  
  
  })
  
  router.get('/create-bucket', (ctx) => {
  
    viewVars.messages = []
    return ctx.render('buckets/create-bucket', viewVars);  
  
  })
  
  router.post('/create-bucket',  koaBody(), async (ctx) => {
  
    viewVars.bucket = await db.createBucket(ctx.request.body)
    viewVars.messages=[viewVars.labels.created]
    return ctx.render('buckets/update-bucket', viewVars); 
  
  })
  
  router.get('update-bucket', '/update-bucket', async (ctx) => {
  
    viewVars.bucket = await db.getBucket(ctx.request.query.name)
    viewVars.messages = []
    return ctx.render('buckets/update-bucket', viewVars);  
  
  })
  
  router.post('update-bucket', '/update-bucket',  koaBody(), async (ctx) => {
    viewVars.bucket = await db.updateBucket(ctx.request.body)
    viewVars.messages = [viewVars.labels.updated]
    return ctx.render('buckets/update-bucket', viewVars);  
  
  })
  
  router.get('delete-bucket', '/delete-bucket', async (ctx) => {
    await db.deleteBucket(ctx.request.query.name)
    viewVars.buckets= await db.getBuckets()
    viewVars.messages = [viewVars.labels.bucket+' '+ ctx.request.query.name +' '+ viewVars.labels.deleted]
    return ctx.render('buckets/buckets', viewVars);  
  
  })    


  return router

}