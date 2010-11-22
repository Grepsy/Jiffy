var DisplayComponent = SpriteComponent.$extend({
  __init__: function (element) {
    this.$super();

    this.onFrame = bind(this.onFrame, this);
    this.onSizeChanged = bind(this.onSizeChanged, this);
    element.parentNode.replaceChild(this.ctx.canvas, element);
  },

  onReady: function () {
    this.container.addListener('frame', this.onFrame);
    this.container.addListener('sizeChanged', this.onSizeChanged);
  },

  onFrame: function () {
    this.ctx.fillRect(0, 0, this.container.width, this.container.height);
    this.draw(this.container);
  },

  onSizeChanged: function (width, height) {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
  },

  draw: function (obj) {
    this.ctx.save();
    var sprite = obj.getComponent('sprite');
    var pos = obj.getComponent('position');

    if (sprite && pos) {
      this.ctx.translate(pos.x, pos.y);
      this.ctx.rotate(Math.round(obj.angle * 100)/100);

      log('drawing', obj, pos.x, pos.y);
      //this.ctx.drawImage(sprite.ctx.canvas, -obj.width / 2, -obj.height / 2);
      this.ctx.drawImage(sprite.ctx.canvas, 0, 0);
    }
    for (var i = 0, e = obj.children.length; i < e; i++) {
      this.draw(obj.children[i]);
    }
    this.ctx.restore();
  }
});