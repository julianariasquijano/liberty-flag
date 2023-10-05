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
  layout: 'index',
  viewExt: 'html',
  cache: false,
  debug: true
});

router.get('flags', '/flags', (ctx) => {

  var flags = db.getFlags()
  return ctx.render('flags', {
    flags: flags
  });  

})

router.get('change-flag', '/change-flag', (ctx) => {

  var flag = db.getFlag(ctx.request.query.name)
  return ctx.render('change-flag', {
    flag: flag,
    messages: []
  });  

})

router.post('save-flag', '/save-flag',  koaBody(), (ctx) => {
  var flag = db.saveFlag(ctx.request.body)
  return ctx.render('change-flag', {
    flag: flag,
    messages: ['Saved']
  });  

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

app.listen(1234);