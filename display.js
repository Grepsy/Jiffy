var Display = Sprite.$extend({
  timer: null,

  __init__: function (ele, width, height, timer) {
    this.$super(width, height);

    this.onFrame = bind(this.onFrame, this);
    this.timer = timer;
		this.display = this;

    ele.parentNode.replaceChild(this.ctx.canvas, ele);
    this.timer.addListener('frame', this.onFrame);
  },

  onFrame: function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (var i = 0, e = this.children.length; i < e; i++) {
      this.draw(this.children[i]);
    }
  },

  draw: function (obj) {
    this.ctx.save();
    this.ctx.translate(obj.x, obj.y);
    this.ctx.rotate(Math.round(obj.angle * 100)/100);
    this.ctx.drawImage(obj.ctx.canvas, -obj.width / 2, -obj.height / 2);
    for (var i = 0, e = obj.children.length; i < e; i++) {
      this.draw(obj.children[i]);
    }
    this.ctx.restore();
  }
});