module.exports = function(viewVars,db,util) {

  'use strict';

  const { koaBody } = require('koa-body');
  const Router = require('@koa/router');
  const router = new Router();

  router.get('/buckets', async (ctx) => {
    let breadcrumb = [{label:"Buckets",url:"/buckets"}]
    ctx.session.breadcrumb = JSON.stringify(breadcrumb)
    viewVars.breadcrumb = breadcrumb
    viewVars.buckets = await db.getBuckets()
    viewVars.messages = []
    return ctx.render('buckets/buckets', viewVars);  
  
  })
  
  router.get('/create-bucket', (ctx) => {
  
    let breadcrumb = [{label:"Create Bucket",url:"/create-bucket"}]
    ctx.session.breadcrumb = JSON.stringify(breadcrumb)
    viewVars.breadcrumb = breadcrumb    
    viewVars.messages = []
    return ctx.render('buckets/create-bucket', viewVars);  
  
  })
  
  router.post('/create-bucket',  koaBody(), async (ctx) => {
  
    viewVars.bucket = await db.createBucket(ctx.request.body)
    viewVars.messages=[viewVars.labels.created]
    return ctx.render('buckets/update-bucket', viewVars); 
  
  })
  
  router.get('update-bucket', '/update-bucket', async (ctx) => {
    let newBreadcrumb = {label:"Bucket",url:"/update-bucket?name="+ctx.request.query.name}
    viewVars.breadcrumb = util.setBreadcrumbCookieList (ctx,newBreadcrumb)
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