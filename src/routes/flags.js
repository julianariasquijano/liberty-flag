module.exports = function(viewVars,db) {

  'use strict';

  const { koaBody } = require('koa-body');
  const Router = require('@koa/router');
  const router = new Router();

  
  router.get('flags', '/flags', async (ctx) => {
  
    viewVars.flags = await db.getFlags()
    viewVars.messages = []
    return ctx.render('flags/flags', viewVars);  
  
  })
  
  router.get('create-flag', '/create-flag', (ctx) => {
  
    viewVars.messages = []
    return ctx.render('flags/create-flag', viewVars);  
  
  })
  
  router.post('create-flag', '/create-flag',  koaBody(), async (ctx) => {
  
    viewVars.flag = await db.createFlag(ctx.request.body)
    viewVars.messages=[viewVars.labels.created]
    return ctx.render('flags/update-flag', viewVars); 
  
  })
  
  router.get('update-flag', '/update-flag', async (ctx) => {
  
    viewVars.flag = await db.getFlag(ctx.request.query.name)
    viewVars.messages = []
    return ctx.render('flags/update-flag', viewVars);  
  
  })
  
  router.post('update-flag', '/update-flag',  koaBody(), async (ctx) => {
    viewVars.flag = await db.updateFlag(ctx.request.body)
    viewVars.messages = [viewVars.labels.updated]
    return ctx.render('flags/update-flag', viewVars);  
  
  })
  
  router.get('delete-flag', '/delete-flag', async (ctx) => {
    await db.deleteFlag(ctx.request.query.name)
    viewVars.flags= await db.getFlags()
    viewVars.messages = [viewVars.labels.flag+' '+ ctx.request.query.name +' '+ viewVars.labels.deleted]
    return ctx.render('flags/flags', viewVars);  
  
  })
  
  router.post('api-get-flag', '/api/flag',  koaBody(), (ctx) => {
    var flag = ""
    try {
      flag = db.getFlag(ctx.request.body.flag)
    } catch (error) {
      ctx.status = 500
      ctx.body = "error"
      console.error(error)
    }
    return ctx.body=flag.value
  })  


  return router

}