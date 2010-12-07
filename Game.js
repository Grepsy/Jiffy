var Game = Class.$extend({
  __init__: function(timer, gameObjects) {
    this.gameObjects = gameObjects;

    timer.addListener('frame', bind(this.onFrame, this));
  },

  onFrame: function(dt) {
    for (var i = this.gameObjects.length - 1; i >= 0; i--) {
      log('frame for ' + this.gameObjects[i].id);
      this.gameObjects[i].fire('frame');
    };
  }
});