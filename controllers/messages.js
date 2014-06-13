'use strict';

var parse = require('co-body');
var redis = require('redis');
var thunk = require('thunkify');

var db = redis.createClient();

var redisCommands = [
    'lrange',
    'lindex',
    'linsert',
    'llen',
    'lpop',
    'lpush',
    'lpushx',
    'lrem',
    'lset',
    'ltrim',
    'mget',
    'migrate',
    'monitor',
    'move',
    'mset',
    'msetnx',
    'rpush'
];

redisCommands.forEach(function(command) {
  db[command] = thunk(db[command]);
}); 

var messages = [
  { id: 0, message: 'Koa next generation web framework for node.js' },
  { id: 1, message: 'Koa is a new web framework designed by the team behind Express' }
];

module.exports.list = function *list() {
  var res = yield db.lrange('dots', 0, -1);
  this.body = res.map(JSON.parse);
};

module.exports.fetch = function *fetch(id) {
  var message = messages[id];
  if (!message) {
    this.throw(404, 'message with id = ' + id + ' was not found');
  }
  this.body = yield message;
};

module.exports.create = function *create() {
  var body = yield parse.json(this);
  yield db.rpush('dots', JSON.stringify( {'message': body.message, 'ballast': new Date()}));
  this.response.body = 'OK';
};
