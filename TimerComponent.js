var Timer = EventTarget.$extend({
  _timer: null,
  _stats: null,
  _useStats: false,

  fps: 25,

  __init__: function(fps, useStats) {
    this.fps = fps || this.fps;
    this._useStats = useStats || this._useStats;
  },

  start: function () {
    var frame = 0,
			that = this;

    if (this._useStats) {
      this._stats = window.setInterval(function () {
        console.log('FPS: ', frame);
        frame = 0;
      }, 1000);
    }

    this._timer = window.setInterval(function () {
      that.fire('frame');
      frame++;
    }, 1000 / this.fps);
  },

  stop: function () {
    window.clearInterval(this._timer);
    if (this._useStats) {
      window.clearInterval(this._stats);
    }
  }
});