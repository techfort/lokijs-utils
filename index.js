function EventEmitter() {}
EventEmitter.prototype.events = {};
EventEmitter.prototype.on = function (eventName, listener) {
  var event = this.events[eventName];
  if (!event) {
    event = this.events[eventName] = [];
  }
  return event.push(listener) - 1;
};
EventEmitter.prototype.emit = function (eventName) {
  if (this.events[eventName]) {
    this.events[eventName].forEach(function (listener) {
      listener.call(null);
    });
  } else {
    throw new Error('No event ' + eventName + ' defined');
  }
};
EventEmitter.prototype.remove = function (eventName, index) {
  if (this.events[eventName]) {
    this.events[eventName].splice(index, 1);
  }
};

function Publisher() {}
Publisher.prototype.topics = {};
Publisher.prototype.register = function (topic, obj, func) {
  if (!this.topics[topic]) {
    this.topics[topic] = [];
  }
  this.topics[topic].push({
    target: obj,
    callback: func
  });
};
Publisher.prototype.publish = function (topic, argsArray) {
  if (this.topics[topic]) {
    this.topics[topic].forEach(function (handler) {
      handler.callback.apply(handler.target, argsArray || []);
    });
  }
};

var pub = new Publisher();
var o = {
  name: 'joe'
};
pub.register('test', o, function (newName) {
  this.name = newName;
});
pub.publish('test', ['jack']);
console.log(o);