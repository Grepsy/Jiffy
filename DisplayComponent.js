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
    this.size = this.container.getComponent('size');

    this.ctx.canvas.width = this.size.width;
    this.ctx.canvas.height = this.size.height;
  },

  onFrame: function () {
    log('drawing display');
    this.ctx.fillRect(0, 0, this.size.width, this.size.height);
    this.draw(this.container);
  },

  onSizeChanged: function (event) {
    this.ctx.canvas.width = event.width;
    this.ctx.canvas.height = event.height;
  },

  draw: function (obj) {
    this.ctx.save();

    var sprite = obj.getComponent('sprite');
    var pos = obj.getComponent('position');
    var size = obj.getComponent('size');

    if (sprite && pos) {
      this.ctx.translate(pos.x, pos.y);
      this.ctx.rotate(Math.round(obj.angle * 100)/100);

      log('drawing ' + obj.id, pos.x, pos.y, size.width, size.height);
      //this.ctx.drawImage(sprite.ctx.canvas, 0, 0);
      this.ctx.drawImage(sprite.ctx.canvas, -size.width / 2, -size.height / 2);
    }
    for (var i = 0, e = obj.children.length; i < e; i++) {
      this.draw(obj.children[i]);
    }
    this.ctx.restore();
  }
});