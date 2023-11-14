module.exports = function(viewVars,db,util) {

  'use strict';

  const { koaBody } = require('koa-body');
  const Router = require('@koa/router');
  const router = new Router();

  
  router.get('/tags', async (ctx) => {
  
    viewVars.tags = await db.getTags()
    viewVars.messages = []
    return ctx.render('tags/tags', viewVars);  
  
  })
  
  router.get('/create-tag', (ctx) => {
  
    viewVars.messages = []
    return ctx.render('tags/create-tag', viewVars);  
  
  })
  
  router.post('/create-tag',  koaBody(), async (ctx) => {
  
    viewVars.tag = await db.createTag(ctx.request.body)
    viewVars.messages=[viewVars.labels.created]
    return ctx.render('tags/update-tag', viewVars); 
  
  })
  
  router.get('/update-tag', async (ctx) => {
  
    viewVars.tag = await db.getTag(ctx.request.query.name)
    viewVars.messages = []
    return ctx.render('tags/update-tag', viewVars);  
  
  })
  
  router.post('/update-tag',  koaBody(), async (ctx) => {
    viewVars.tag = await db.updateTag(ctx.request.body)
    viewVars.messages = [viewVars.labels.updated]
    return ctx.render('tags/update-tag', viewVars);  
  
  })
  
  router.get('delete-tag', '/delete-tag', async (ctx) => {
    await db.deleteTag(ctx.request.query.name)
    viewVars.tags= await db.getTags()
    viewVars.messages = [viewVars.labels.tag+' '+ ctx.request.query.name +' '+ viewVars.labels.deleted]
    return ctx.render('tags/tags', viewVars);  
  
  })

  return router

}