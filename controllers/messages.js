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

module.exports.list = function *list() {
  var res = yield db.lrange('dots', 0, -1);
  this.body = res.map(JSON.parse);
};

module.exports.fetch = function *fetch(sid) {
  console.log(sid);
  var id = parseInt(this.params.id);
  console.log('Dot: ' + id);
  var message = yield db.lindex('dots', id);
  if (!message) {
    this.throw(404, 'message with id = ' + id + ' was not found');
  }
  this.body = JSON.parse(message);
};

module.exports.create = function *create() {
  console.log(this);
  var body = yield parse.json(this);
  console.log(body);
  yield db.rpush('dots', JSON.stringify( {'message': body, 'ballast': new Date()}));
  this.response.body = 'OK';
};
