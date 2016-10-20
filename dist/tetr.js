"use strict";

function TetrisGame(config) {
  this.fieldSize = [config.width, config.height];
  this.reset();
}

TetrisGame.prototype.delays = {0: 0.7, 1: 0.5, 2: 0.4, 3: 0.3, 4: 0.24, 5: 0.18};

TetrisGame.prototype.rowsPerLevel = {0: 3, 1: 3, 2: 3, 3: 3, 4: 3, 5: Infinity};

TetrisGame.prototype.reset = function() {
  this.existingBlocks = [];
  this.currentShape = Shape.getRandom();
  this.rowsCleared = 0;
  this.score = 0;
  this.over = false;
};

/**
 * Return the number of points for a row clear
 * based on the level and number of rows cleared
 */
TetrisGame.prototype.getPoints = function(level, rowsCleared) {
  var pointsForLines = {1: 40, 2: 100, 3: 300, 4: 1200};
  return pointsForLines[rowsCleared]*(level+1);
};

/**
 * Return the current level
 * (this is determied through the rowsCleared property)
 */
TetrisGame.prototype.getLevel = function() {
  var level = 0;
  var rows = 0;
  while (true) {
    rows += this.rowsPerLevel[level];
    if (this.rowsCleared < rows) {
      return level;
    }
    level ++;
  }
};

/**
 * get current delay (in s) for this level
 */
TetrisGame.prototype.getDelay = function(level) {
  return this.delays[this.getLevel()];
}

/**
 * This will advance the game by one step.
 * It should be called periodically
 */
TetrisGame.prototype.tick = function() {
  var nextShape = this.currentShape.moved('d');
  if (this.canMoveTo(nextShape)) {
    this.currentShape = nextShape;
  } else {
    // shape is hitting bottom or another shape
    // create a new shape instead
    this.existingBlocks = this.existingBlocks.concat(this.currentShape.blocks);
    this.clearFullRows();
    this.currentShape = Shape.getRandom();
    if (!this.canMoveTo(this.currentShape)) {
      this.over = true;
    }
  }
};

/**
 * Check if a shape can move to a certain position
 * (i.e. the position is not occupied)
 */
TetrisGame.prototype.canMoveTo = function(shape) {
  return shape.isInsideField(this.fieldSize) && !shape.overlapsAny(this.existingBlocks);
};

/**
 * Move active shape in specified direction (if possible)
 * This is a user-initiated action
 * returns true if the model changed as a result of this
 * function call
 */
TetrisGame.prototype.moveCurrentShape = function(direction) {
  var nextShape = this.currentShape.moved(direction);
  if (this.canMoveTo(nextShape)) {
    this.currentShape = nextShape;
    return true;
  }
  return false;
};

/**
 * Rotate the active shape clockwise (if possible)
 * Returns true if the model changed as a result of this
 * function call
 */
TetrisGame.prototype.rotateCurrentShape = function() {
  var nextShape = this.currentShape.rotated();
  if (this.canMoveTo(nextShape)) {
    this.currentShape = nextShape;
    return true;
  }
  return false;
};

TetrisGame.prototype.clearFullRows = function(existingBlocks, fieldSize) {
  // removes complete rows from the model
  var counts = [];
  for (var i = 0; i < this.fieldSize[1]; i ++) {
    counts.push(0);
  }
  this.existingBlocks.forEach(function(block) {
    counts[block.position[1]] ++;
  });
  var newRowsCleared = 0;
  for (var i = 0; i < this.fieldSize[1]; i ++) {
    if (counts[i] === this.fieldSize[0]) {
      // there's a full row
      var newExistingBlocks = []
      // copy all but the full row
      this.existingBlocks.forEach(function(block, index) {
        if (block.position[1] > i) {
          // keep rows below full row the same
          newExistingBlocks.push(block);
        } else if (block.position[1] < i) {
          // move rows above full row further down
          block.position[1] ++;
          newExistingBlocks.push(block);
        }
      });
      // overwrite the original
      this.existingBlocks = newExistingBlocks;
      newRowsCleared ++;
    }
  }
  if (newRowsCleared) {
    this.rowsCleared += newRowsCleared;
    this.score += this.getPoints(this.getLevel(), newRowsCleared);
  }
}

/**
 * Return an array of Blocks representing the playing field
 */
TetrisGame.prototype.getField = function() {
  // create empty field
  var field = [];
  for (var i = 0; i < this.fieldSize[1]; i ++) {
    var row = [];
    for (var j = 0; j < this.fieldSize[0]; j ++) {
      row.push(undefined);
    }
    field.push(row);
  }
  this.existingBlocks.forEach(function(block) {
    field[block.position[1]][block.position[0]] = block;
  });
  this.currentShape.blocks.forEach(function(block) {
    field[block.position[1]][block.position[0]] = block;
  })
  return field;
}
"use strict";

function Shape() {
}

Shape.templates = {
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

Shape.templateNames = ['O', 'I', 'L', 'J', 'S', 'Z', 'T'];

/**
 * create and return a random new shape
 */
Shape.getRandom = function() {
  return Shape.create(Shape.templateNames[Math.floor(Math.random() * Shape.templateNames.length)]);
};

/**
 * get a new Shape by name
 */
Shape.create = function(name) {
  var shape = new Shape();
  shape.center = Shape.templates[name].center.slice();
  shape.blocks = Shape.templates[name].blocks.map(function(block) {
    return new Block(block[0], block[1], Shape.templates[name].color);
  });
  return shape;
}

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
