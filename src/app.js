'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const render = require('koa-ejs');
const path = require('path');
var db = require('./db_handler.js');
const { koaBody } = require('koa-body');

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  try {
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

router.get('flags', '/flags', (ctx) => {

  return ctx.render('flags', {
    flags: db.getFlags()
  });  

})

router.get('create-flag', '/create-flag', (ctx) => {

  return ctx.render('create-flag', {
    messages: []
  });  

})

router.post('create-flag', '/create-flag',  koaBody(),(ctx) => {

  var flag = db.createFlag(ctx.request.body)
  return ctx.render('update-flag', {
    flag: flag,
    messages: ['Created']
  }); 

})

router.get('update-flag', '/update-flag', (ctx) => {

  var flag = db.getFlag(ctx.request.query.name)
  return ctx.render('update-flag', {
    flag: flag,
    messages: []
  });  

})

router.post('update-flag', '/update-flag',  koaBody(), (ctx) => {
  var flag = db.updateFlag(ctx.request.body)
  return ctx.render('update-flag', {
    flag: flag,
    messages: ['Updated']
  });  

})

router.get('delete-flag', '/delete-flag', (ctx) => {
  db.deleteFlag(ctx.request.query.name)
  return ctx.render('flags', {
    flags: db.getFlags(),
    messages: ['Flag '+ ctx.request.query.name +' Deleted']
  });  

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

app.listen(8000);