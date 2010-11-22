var TimerComponent = Component.$extend({
  _timer: null,
  _stats: null,
  _logFps: false,

  type: 'timer',
  frame: 0,
  fps: 25,

  __init__: function(fps, logFps) {
    this.fps = fps || this.fps;
    this._logFps = logFps || this._logFps;
  },

  start: function () {
    if (this._logFps) {
      this._stats = window.setInterval(bind(this.onStats, this), 1000);
    }

    this._timer = window.setInterval(bind(this.onFrame, this), 1000 / this.fps);
  },

  stop: function () {
    window.clearInterval(this._timer);
    if (this._logFps) {
      window.clearInterval(this._stats);
    }
  },

  onFrame: function () {
    this.container.fire('frame');
    this.frame++;
  },

  onStats: function() {
    console.log('FPS: ', this.frame);
  }
});