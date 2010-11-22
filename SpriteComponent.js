var SpriteComponent = Component.$extend({
  _display: null,
  type: "sprite",
  ctx: null,

  __init__: function() {
    var canvas = document.createElement('canvas');
    this.ctx = canvas.getContext('2d');
  },

  onReady: function() {
    this.container.addListener('sizeChanged', bind(this.onSizeChanged, this));
  },

  onSizeChanged: function() {
    log(this, 'Container changed size, resetting canvas.');
    this.ctx.canvas.width = container.width;
    this.ctx.canvas.height = container.height;
  }
});