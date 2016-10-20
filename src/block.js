"use strict";

function Block(x, y, color) {
  this.position = [x, y];
  this.color = color;
}

Block.prototype.copy = function() {
  return new Block(this.position.x, this.position.y, this.color);
};

Block.prototype.moved = function(direction) {
  var x = this.position[0];
  var y = this.position[1];
  var color = this.color;
  if (direction === 'r') {
    x ++;
  } else if (direction === 'l') {
    x --;
  } else if (direction === 'd') {
    y ++;
  } else {
    throw 'Invalid direction: ' + direction;
  }
  return new Block(x, y, color);
};
