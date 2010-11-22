var AnimationComponent = SpriteComponent.$extend({
  frame: 0,
  image: null,
  frames: 0,
  looping: true,
  running: false,

  __init__: function (imageurl, width, height) {
    this.$super(width, height);
    this.onFrame = bind(this.onFrame, this);
    this.onAnimationLoaded = bind(this.onAnimationLoaded, this);

    this.image = document.createElement('img');
    this.image.addEventListener('load', this.onAnimationLoaded, false);
    this.image.setAttribute('src', imageurl);
  },

  start: function () {
    if (this.running) return;
    if (this.display) {
      this.container.addListener('frame', this.onFrame);
    }
    this.running = true;
  },

  stop: function () {
    if (!this.running) return;
    if (this.display) {
      this.container.removeListener('frame', this.onFrame);
    }
    this.running = false;
  },

  // override
  onAdded: function () {
    if (this.running) {
      this.container.addListener('frame', this.onFrame);
    }
  },

  // override
  onRemoving: function () {
    if (this.running) {
      this.container.removeListener('frame', this.onFrame);
    }
  },

  onAnimationLoaded: function () {
		console.log('Animation loaded', this.image);
    this.frames = Math.ceil((this.image.width * this.image.height) / (this.width * this.height));
    console.log(this.frames);
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