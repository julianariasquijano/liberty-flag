'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const render = require('koa-ejs');
const path = require('path');
var db = require('./mongodb_handler.js');
const session = require('koa-session');

const app = new Koa();

app.keys = ['lkaweob923jkpselld34k'];
app.use(session(app))

var viewVars = {}
viewVars.labels = {}

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

var flagsRouter = require ('./routes/flags.js')(viewVars,db);
app.use(flagsRouter.routes())
app.use(flagsRouter.allowedMethods())

var bucketsRouter = require ('./routes/buckets.js')(viewVars,db);
app.use(bucketsRouter.routes())
app.use(bucketsRouter.allowedMethods())

var bucketsRouter = require ('./routes/main.js')(viewVars,db);
app.use(bucketsRouter.routes())
app.use(bucketsRouter.allowedMethods())


render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: true
});

app.listen(8000, '0.0.0.0');