'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const render = require('koa-ejs');
const path = require('path');
var db = require('./mongodb_handler.js');
const { koaBody } = require('koa-body');
const session = require('koa-session');

const app = new Koa();
const router = new Router();

app.keys = ['lkaweob923jkpselld34k'];
app.use(session(app))

var viewVars = {}

app.use(async (ctx, next) => {
  try {
    let language = ctx.session.language || "english"
    viewVars.language = language
    let languageLabels = require('./languages/'+language+'.js')
    viewVars.labels = languageLabels.labels
    await next()
  } catch(err) {
    console.log(err.status)
    ctx.status = err.status || 500;
    ctx.body = err.message;
  }
});


render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: true
});

router.get('root', '/', async (ctx) => {

  let userId = ctx.session.userId || ""
  if (userId!==""){
    viewVars.buckets = await db.getBuckets()
    viewVars.messages = []
    return ctx.render('buckets/buckets', viewVars);  
  }
  else {
      
      return ctx.render('login', viewVars);     
  }
})

router.post('login', '/login',koaBody(), async (ctx) => {

  ctx.session.userId = "1234"
  ctx.session.language = ctx.request.body.language
  let languageLabels = require('./languages/'+ctx.session.language+'.js')
  viewVars.labels = languageLabels.labels

  viewVars.flags = await db.getFlags()
  viewVars.messages = []
  return ctx.render('flags/flags', viewVars);    

})
router.get('logout', '/logout', async (ctx) => {

  ctx.session.userId = ""
  viewVars.messages = []
  return ctx.render('login', viewVars);    

})

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

router.get('error', '/error', (ctx) => {
  ctx.throw(500, 'App internal server error');
});

router.get('status', '/status', (ctx) => {
  ctx.status = 200;
  ctx.body   = 'ok';
})

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8000, '0.0.0.0');