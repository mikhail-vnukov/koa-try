'use strict';
var messages = require('./controllers/messages')
	,compress = require('koa-compress')
	,logger = require('koa-logger')
	,router = require('koa-router')
	,koa = require('koa')
	,app = module.exports = koa();

// Logger
app.use(logger());
app.use(router(app));

app.get('/dots', messages.list);
app.post('/dots', messages.create);

// Compress
app.use(compress());

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}