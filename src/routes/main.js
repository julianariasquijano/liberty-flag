module.exports = function(viewVars,db) {

  'use strict';

  const { koaBody } = require('koa-body');
  const Router = require('@koa/router');
  const router = new Router();

  router.get('root', '/', async (ctx) => {

    let userId = ctx.session.userId || ""
    if (userId!==""){
      viewVars.buckets = await db.getBuckets()
      viewVars.messages = []
      return ctx.render('buckets/buckets', viewVars);  
    }
    else {
        
        return ctx.render('./login', viewVars);     
    }
  })
  
  router.post('/login',koaBody(), async (ctx) => {
  
    ctx.session.userId = "1234"
    ctx.session.language = ctx.request.body.language
    let languageLabels = require('../languages/'+ctx.session.language+'.js')
    viewVars.labels = languageLabels.labels
  
    viewVars.buckets = await db.getBuckets()
    viewVars.messages = []
    return ctx.render('buckets/buckets', viewVars);    
  
  })
  router.get('logout', '/logout', async (ctx) => {
  
    ctx.session.userId = ""
    viewVars.messages = []
    return ctx.render('login', viewVars);    
  
  })
  
  
  router.get('error', '/error', (ctx) => {
    ctx.throw(500, 'App internal server error');
  });
  
  router.get('status', '/status', (ctx) => {
    ctx.status = 200;
    ctx.body   = 'ok';
  })

  return router

}