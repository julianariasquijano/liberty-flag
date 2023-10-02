'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const render = require('koa-ejs');
const path = require('path');

const app = new Koa();
const router = new Router();

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

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(1234);