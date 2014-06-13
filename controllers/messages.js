'use strict';

var parse = require('co-body');
var redis = require('redis');
var redisCommands = require('redis/lib/commands.js');
var thunk = require('thunkify');

var db = redis.createClient();

redisCommands.forEach(function(fullCommand) {
  var command = fullCommand.split(' ')[0];
  console.log(command);
  db[command] = thunk(db[command]);
}); 

var messages = [
  { id: 0, message: 'Koa next generation web framework for node.js' },
  { id: 1, message: 'Koa is a new web framework designed by the team behind Express' }
];

module.exports.list = function *list() {
  console.log('Listing all dots');
  console.log(db.lrange.toString()); 
  var res = yield db.lrange('dots', 0, -1);
  console.log('Dots: ' + res);
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
