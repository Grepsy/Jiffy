var BoxComponent = SpriteComponent.$extend({
  onReady: function() {
    this.container.addListener('sizeChanged', bind(this.onSizeChanged, this));
    this.size = this.container.getComponent('size');
  },

  draw: function() {
    this.ctx.fillStyle = 'rgba(255, 0, 0, .2)';
    this.ctx.strokeStyle = 'rgba(255, 0, 0, .5)';
    this.ctx.lineWidth = 1.1;
    this.ctx.fillRect(0, 0, this.size.width, this.size.height);
    this.ctx.strokeRect(0, 0, this.size.width, this.size.height);
  },

  onSizeChanged: function() {
    log(this, 'Container changed size, resetting canvas.');
    this.ctx.canvas.width = this.size.width;
    this.ctx.canvas.height = this.size.height;
    this.draw();
  }
});