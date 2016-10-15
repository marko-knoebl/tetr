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
