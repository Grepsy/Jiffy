var PositionComponent = Component.$extend({
  type: 'position',
  x: 0,
  y: 0,

  __init__: function(x, y) {
    this.x = x;
    this.y = y;
  },

  onReady: function () {
    this.container.addListener('setPosition', bind(function(event) {
      this.x = event.x;
      this.y = event.y;
      log(this.container, this.x, this.y)
    }, this));
  }
});