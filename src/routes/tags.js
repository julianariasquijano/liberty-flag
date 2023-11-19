module.exports = function(viewVars,db,util) {

  'use strict';

  const { koaBody } = require('koa-body');
  const Router = require('@koa/router');
  const router = new Router();

  
  router.get('/tags', async (ctx) => {
  
    let breadcrumbs = [{label:"Tags",url:"/tags"}]
    ctx.session.breadcrumbs = JSON.stringify(breadcrumbs)    
    viewVars.breadcrumbs = breadcrumbs
    viewVars.tags = await db.getTags()
    viewVars.messages = []
    return ctx.render('tags/tags', viewVars);  
  
  })
  
  router.get('/create-tag', (ctx) => {
  
    let newBreadcrumb = {label:"Create Tag",url:"/create-tag"}
    viewVars.breadcrumbs = util.setBreadcrumbCookieList (ctx,newBreadcrumb,0)  
    viewVars.messages = []
    return ctx.render('tags/create-tag', viewVars);  
  
  })
  
  router.post('/create-tag',  koaBody(), async (ctx) => {
    let newBreadcrumb = {label:"Tag",url:"/update-tag?name="+ctx.request.body["tag-name"]}
    viewVars.breadcrumbs = util.setBreadcrumbCookieList (ctx,newBreadcrumb,0)
    viewVars.tag = await db.createTag(ctx.request.body)
    viewVars.messages=[viewVars.labels.created]
    return ctx.render('tags/update-tag', viewVars); 
  
  })
  
  router.get('/update-tag', async (ctx) => {
  
    let newBreadcrumb = {label:"Tag",url:"/update-tag?name="+ctx.request.query.name}
    viewVars.breadcrumbs = util.setBreadcrumbCookieList (ctx,newBreadcrumb)
    viewVars.tag = await db.getTag(ctx.request.query.name)
    viewVars.messages = []
    return ctx.render('tags/update-tag', viewVars);  
  
  })
  
  router.post('/update-tag',  koaBody(), async (ctx) => {
    viewVars.breadcrumbs = util.setBreadcrumbCookieList (ctx)    
    viewVars.tag = await db.updateTag(ctx.request.body)
    viewVars.messages = [viewVars.labels.updated]
    return ctx.render('tags/update-tag', viewVars);  
  
  })
  
  router.get('delete-tag', '/delete-tag', async (ctx) => {
    let breadcrumbs = [{label:"Tags",url:"/tags"}]
    ctx.session.breadcrumbs = JSON.stringify(breadcrumbs)
    viewVars.breadcrumbs = breadcrumbs
    await db.deleteTag(ctx.request.query.name)
    viewVars.tags= await db.getTags()
    viewVars.messages = [viewVars.labels.tag+' '+ ctx.request.query.name +' '+ viewVars.labels.deleted]
    return ctx.render('tags/tags', viewVars);  
  
  })

  return router

}