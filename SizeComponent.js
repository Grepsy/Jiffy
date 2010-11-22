var SizeComponent = Component.$extend({
  type: 'size',
  width: 0,
  height: 0,

  __init__: function(width, height) {
    this.width = width;
    this.height = height;
  },

  onReady: function() {
    this.container.addListener('setSize', function(w, h) {
      this.width = w;
      this.height = h;
      this.container.fire('sizeChanged');
    });
  }
});