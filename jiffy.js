/*jslint white: true, browser: true, devel: true, debug: true, evil: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*global window Class Box2D EventTarget */

function bind(obj, scope) {
  return function() {
    return obj.apply(scope, arguments);
  }
}

var Sprite = Class.$extend({
  _display: null,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  angle: 0,
  parent: null,
  children: null,
  ctx: null,

  get display() { return this._display; },
  set display(val) {
    for (var i = 0, l = this.children.length; i < l; i++) {
      this.children[i].display = val;
    }
    this._display = val;
  },

  __init__: function (width, height) {
    var canvas = document.createElement('canvas');
    this.width = canvas.width = width;
    this.height = canvas.height = height;
    this.ctx = canvas.getContext('2d');
    this.children = [];
  },

  add: function (obj) {
    this.children.push(obj);
    obj.parent = this;
    obj.display = this.display;

    obj.onAdded();
  },

  remove: function (obj) {
    obj.onRemoving();

    this.children = this.children.filter(function (item) {
      return item === obj;
    });
    obj.parent = null;
    obj.display = null;
  },

  destroy: function () {
    this.parent.remove(this);
  },

  // Virtual
  onAdded: function () { },

  // Virtual
  onRemoving: function () { }
});

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
    //console.log(obj.x, obj.y, obj.width, obj.height);
    this.ctx.translate(obj.x, obj.y);
    this.ctx.rotate(obj.angle);
    this.ctx.drawImage(obj.ctx.canvas, -obj.width / 2, -obj.height / 2);
    for (var i = 0, e = obj.children.length; i < e; i++) {
      this.draw(obj.children[i]);
    }
    this.ctx.restore();
  }
});

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

var World = Class.$extend({
  _world: null,
  _timer: null,
  _debug: null,

	ratio: 30,
  gravity: { x: 0, y: 9.81 },

  __init__: function (timer, ratio, gravity) {
    this.onFrame = bind(this.onFrame, this);
    this.onFrameDebug = bind(this.onFrameDebug, this);

    var gravity = new Box2D.Common.Math.b2Vec2(this.gravity.x, this.gravity.y);
    this._world = new Box2D.Dynamics.b2World(gravity, true);
    this._timer = timer;

    this._timer.addListener('frame', this.onFrame);
  },

  debug: function (canvas) {
    this._debug = new Box2D.Dynamics.b2DebugDraw();
    this._debug.SetSprite(canvas.getContext('2d'));
    this._debug.SetDrawScale(this.ratio);
    this._debug.SetFillAlpha(0.3);
    this._debug.SetLineThickness(1.0);
    this._debug.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
    this._world.SetDebugDraw(this._debug);
    this._timer.addListener('frame', this.onFrameDebug);
  },

  onFrame: function () {
    this._world.Step(1 / this._timer.fps, 6, 2, true);
    this._world.ClearForces();
  },

  onFrameDebug: function () {
    this._world.DrawDebugData();
  }
});

var PSprite = Sprite.$extend({
	_b2body: null,

  world: null,
	get x()    		        { return this._b2body.GetPosition().x * this.world.ratio; },
	//set x(val) 		        { this._b2body.GetPosition.x = (val + this.width / 2) / this.world.ratio; },
	get y()    		        { return this._b2body.GetPosition().y * this.world.ratio; },
	//set y(val) 		        { this._b2body.GetPosition.y = (val + this.height / 2) / this.world.ratio; },
	get angle() 	        { return this._b2body.GetAngle(); },
  set angle(val)        { this._b2body.SetAngularVelocity(val); },
	// get density() 	      { return this._b2body.density; },
	// set density(val)      { this._b2body.density = val; },
	// get friction() 	      { return this._b2body.friction; },
	// set friction(val)     { this._b2body.friction = val; },
	// get restitution()     { return this._b2body.restitution; },
	// set restitution(val)  { this._b2body.restitution = val; },
	_isStatic: true,

  __init__: function (x, y, width, height, world, isStatic) {
    this.$super(width, height);
    this.world = world;

    this.createBody(x, y, isStatic);
  },

	createBody: function(x, y, isStatic) {
		var bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.position.x = (x + this.width / 2) / this.world.ratio;
    bodyDef.position.y = (y + this.height / 2) / this.world.ratio;
    bodyDef.type = isStatic ? Box2D.Dynamics.b2Body.b2_staticBody : Box2D.Dynamics.b2Body.b2_dynamicBody;

    var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.density = 0.8;
    fixtureDef.friction = 0.1;
    fixtureDef.restitution = 0.1;
  	fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    //fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape(this.width / 2 / this.RATIO);
    fixtureDef.shape.SetAsBox(this.width / 2 / this.world.ratio, this.height / 2 / this.world.ratio);

    this._b2body = this.world._world.CreateBody(bodyDef);
    this._b2body.CreateFixture(fixtureDef);
	}
});

var Box = Sprite.$extend({
  __init__: function (width, height) {
    this.$super(width, height);
    this.ctx.fillStyle = 'rgba(255, 0, 0, 128)';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
});

var PBox = PSprite.$extend({
  __init__: function (x, y, width, height, world, isStatic) {
    this.$super(x, y, width, height, world, isStatic);
    this.ctx.fillStyle = 'rgba(255, 0, 0, .5)';
    this.ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.strokeRect(0, 0, this.width, this.height);
  }
});

var FrameTimer = EventTarget.$extend({
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