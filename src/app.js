'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const render = require('koa-ejs');
const path = require('path');
var db = require('./mongodb_handler');
var util = require('./utilities');
const session = require('koa-session');
const mount = require('koa-mount')
const serve = require('koa-static')

const app = new Koa();

app.keys = ['lkaweob923jkpselld34k'];
app.use(session(app))

var viewVars = {}
viewVars.labels = {}

app.use(async (ctx, next) => {
  try {
    viewVars.breadcrumbs = []
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

app.use(mount('/static',serve(path.join(__dirname, '/static'))))
var flagsRouter = require ('./routes/flags.js')(viewVars,db,util);
app.use(flagsRouter.routes())
app.use(flagsRouter.allowedMethods())

var bucketsRouter = require ('./routes/buckets.js')(viewVars,db,util);
app.use(bucketsRouter.routes())
app.use(bucketsRouter.allowedMethods())

var tagsRouter = require ('./routes/tags.js')(viewVars,db,util);
app.use(tagsRouter.routes())
app.use(tagsRouter.allowedMethods())

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