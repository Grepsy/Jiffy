var PositionComponent = Component.$extend({
  type: 'position',
  x: 0,
  y: 0,

  __init__: function(x, y) {
    this.x = x;
    this.y = y;
  },

  onReady: function () {
    this.container.addListener('setPosition', function(x, y) {
      this.x = x;
      this.y = y;
    });
  }
});