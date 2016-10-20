"use strict";

var shapeTemplates = {
  O: {
    blocks: [[4, 0], [5, 0], [4, 1], [5, 1]],
    center: [4.5, 0.5],
    color: '#3f51b5'
  },
  I: {
    blocks: [[4, 0], [4, 1], [4, 2], [4, 3]],
    center: [4, 1],
    color: '#00bcd4'
  },
  L: {
    blocks: [[4, 0], [4, 1], [4, 2], [5, 2]],
    center: [4, 1],
    color: '#9c27b0'
  },
  J: {
    blocks: [[5, 0], [5, 1], [5, 2], [4, 2]],
    center: [5, 1],
    color: '#9e9e9e'
  },
  S: {
    blocks: [[4, 1], [5, 1], [5, 0], [6, 0]],
    center: [5, 0],
    color: '#4caf50'
  },
  Z: {
    blocks: [[4, 0], [5, 0], [5, 1], [6, 1]],
    center: [5, 0],
    color: '#f44336'
  },
  T: {
    blocks: [[4, 0], [5, 0], [6, 0], [5, 1]],
    center: [5, 0],
    color: '#795548'
  }
};

var templateNames = ['O', 'I', 'L', 'J', 'S', 'Z', 'T'];

function Shape() {
}

/**
 * create and return a random new shape
 */
Shape.getRandom = function() {
  var name = templateNames[Math.floor(Math.random() * templateNames.length)];
  var shape = new Shape();
  shape.center = shapeTemplates[name].center.slice();
  shape.blocks = shapeTemplates[name].blocks.map(function(block) {
    return new Block(block[0], block[1], shapeTemplates[name].color);
  });
  return shape;
};

/**
 * return a copy of the shape that was moved in the specified direction
 * ('r', 'l', 'd')
 */
Shape.prototype.moved = function(direction) {
  // return a copy of the shape moved in a specific direction
  var movedShape = new Shape();
  movedShape.center = this.center.slice();
  movedShape.blocks = this.blocks.map(function(block) {
    return block.moved(direction);
  });
  if (direction === 'r') {
    movedShape.center[0] ++;
  } else if (direction === 'l') {
    movedShape.center[0] --;
  } else if (direction === 'd') {
    movedShape.center[1] ++;
  } else {
    throw 'invalid direction: ' + direction;
  }
  return movedShape;
};

/**
 * return a copy of the shape that was rotated 90° clockwise
 */
Shape.prototype.rotated = function() {
  var center = this.center;
  var movedBlocks = this.blocks.map(function(block) {
    return new Block(
      -(block.position[1]-center[1])+center[0],
      block.position[0]-center[0]+center[1],
      block.color
    );
  });
  var newShape = new Shape();
  newShape.center = center.slice();
  newShape.blocks = movedBlocks;
  return newShape;
};

/**
 * check whether the shape is inside the field
 */
Shape.prototype.isInsideField = function(fieldSize) {
  var inside = true
  this.blocks.forEach(function(block) {
    if (block.position[0] < 0 || block.position[0] > fieldSize[0]-1 || block.position[1] > fieldSize[1]-1) {
      inside = false;
    }
  });
  return inside;
};

/**
 * check if the shape overlaps with existing blocks
 */
Shape.prototype.overlapsAny = function(existingBlocks) {
  for (var i in existingBlocks) {
    for (var j in this.blocks) {
      if (existingBlocks[i].position[0] === this.blocks[j].position[0] && existingBlocks[i].position[1] === this.blocks[j].position[1]) {
        return true;
      }
    }
  }
  return false;
}
