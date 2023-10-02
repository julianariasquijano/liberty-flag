'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const render = require('koa-ejs');
const path = require('path');

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

router.get('index', '/', (ctx) => {
  let featureFlags = [];

  featureFlags.push({
    meta_name: 'light-theme',
    meta_value: '0'
  });

  featureFlags.push({
    meta_name: 'authorization',
    meta_value: '1'
  });

  return ctx.render('index', {
    featureFlags: featureFlags
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