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
    center: [4, 1],
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

function Shape(name) {
}

function getRandomShape() {
  var shape = new Shape();
  var name = templateNames[Math.floor(Math.random() * templateNames.length)];
  shape.center = shapeTemplates[name].center.slice();
  var blocks = [];
  shapeTemplates[name].blocks.forEach(function(block) {
    blocks.push(block.slice());
  });
  shape.blocks = blocks;
  shape.color = shapeTemplates[name].color;
  return shape;
}

Shape.prototype.moved = function(direction) {
  // return a copy of the shape moved in a specific direction
  var movedShape = new Shape();
  movedShape.blocks = [];
  movedShape.center = this.center.slice();
  movedShape.color = this.color;
  this.blocks.forEach(function(block) {
    block = block.slice();
    if (direction === 'r') {
      block[0] ++;
    } else if (direction == 'l') {
      block[0] --;
    } else if (direction == 'u') {
      block[1] --;
    } else if (direction == 'd') {
      block[1] ++;
    } else {
      throw 'invalid direction';
    }
    movedShape.blocks.push(block);
  });
  if (direction === 'r') {
    movedShape.center[0] ++;
  } else if (direction === 'l') {
    movedShape.center[0] --;
  } else if (direction === 'u') {
    movedShape.center[1] --;
  } else if (direction === 'd') {
    movedShape.center[1] ++;
  } else {
    throw 'invalid direction';
  }
  return movedShape;
};

Shape.prototype.rotated = function() {
  // return a copy of the shape rotated 90° clockwise
  var center = this.center;
  var movedBlocks = [];
  this.blocks.forEach(function(block) {
    var newBlock = [-(block[1]-center[1])+center[0], block[0]-center[0]+center[1]];
    movedBlocks.push(newBlock);
  });
  var newShape = new Shape();
  newShape.center = center;
  newShape.blocks = movedBlocks;
  newShape.color = this.color;
  return newShape;
};

Shape.prototype.isInsideField = function() {
  var inside = true
  this.blocks.forEach(function(block) {
    if (block[0] < 0 || block[0] > fieldSize[0]-1 || block[1] > fieldSize[1]-1) {
      inside = false;
    }
  });
  return inside;
};

Shape.prototype.overlapsAny = function(existingBlocks) {
  // check if the shape overlaps with existing blocks
  for (var i in existingBlocks) {
    for (var j in this.blocks) {
      if (existingBlocks[i][0] === this.blocks[j][0] && existingBlocks[i][1] === this.blocks[j][1]) {
        return true;
      }
    }
  }
  return false;
}
