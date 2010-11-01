var Animation = Sprite.$extend({
  frame: 0,
  image: null,
  frames: 0,
  looping: true,
  running: false,

  __init__: function (imageurl, width, height, timer) {
    this.$super(width, height);
		this.timer = timer;
    this.onFrame = bind(this.onFrame, this);
    this.onAnimationLoaded = bind(this.onAnimationLoaded, this);

    this.image = document.createElement('img');
    this.image.addEventListener('load', this.onAnimationLoaded, false);
    this.image.setAttribute('src', imageurl);
  },

  start: function () {
    if (this.running) return;
    if (this.display) {
      this.timer.addListener('frame', this.onFrame);
    }
    this.running = true;
  },

  stop: function () {
    if (!this.running) return;
    if (this.display) {
      this.timer.removeListener('frame', this.onFrame);
    }
    this.running = false;
  },

  // override
  onAdded: function () {
    if (this.running) {
      this.display.addListener('frame', this.onFrame);
    }
  },

  // override
  onRemoving: function () {
    if (this.running) {
      this.display.removeListener('frame', this.onFrame);
    }
  },

  onAnimationLoaded: function () {
		console.log('Animation loaded', this.image);
    this.frames = (this.image.width * this.image.height) / (this.width * this.height);
    this.start();
  },

  onFrame: function () {
    var sx = this.frame * this.width % this.image.width,
        sy = Math.floor((this.frame * this.width) / this.image.width) * this.height;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.image, sx, sy, this.width, this.height, 0, 0, this.width, this.height);

    this.frame = ++this.frame % this.frames;
    if (!this.looping && this.frame === 0) {
      this.stop();
    }
  }
});