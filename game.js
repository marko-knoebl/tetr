"use strict";

function TetrisGame(config) {
  this.fieldSize = [config.width, config.height];
  this.existingBlocks = [];
  this.currentShape = Shape.getRandom();
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
    }
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
