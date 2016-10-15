"use strict";

function TetrisGame(config) {
  this.fieldSize = [config.width, config.height];
  this.existingBlocks = [];
  this.currentShape = Shape.getRandom();
}

/**
 * Check if a shape can move to a certain position
 * (i.e. the position is not occupied)
 */
TetrisGame.prototype.canMoveTo = function(shape) {
  return shape.isInsideField(this.fieldSize) && !shape.overlapsAny(this.existingBlocks);
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
