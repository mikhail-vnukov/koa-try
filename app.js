'use strict';
var messages = require('./controllers/messages')
	,compress = require('koa-compress')
	,logger = require('koa-logger')
	,router = require('koa-router')
	,koa = require('koa')
	,cors = require('koa-cors')
	,app = module.exports = koa();

app.use(cors());
app.use(logger());
app.use(router(app));

app.get('/dots', messages.list);
// app.post('/dots', messages.create);
app.get('/dot/:id', messages.fetch);
app.put('/dot/:id', messages.create);


// Compress
app.use(compress());

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}