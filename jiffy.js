/*jslint white: true, browser: true, devel: true, debug: true, evil: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*global window Class Box2D EventTarget */

function bind(obj, scope) {
  return function() {
    return obj.apply(scope, arguments);
  }
}

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
    this._world.Step(1 / this._timer.fps, 10, 10, true);
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
    fixtureDef.density = 1;
    fixtureDef.friction = 0.3;
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
    this.ctx.fillStyle = 'rgba(255, 0, 0, .2)';
    this.ctx.strokeStyle = 'rgba(255, 0, 0, .5)';
    this.ctx.lineWidth = 1.1;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.strokeRect(0, 0, this.width, this.height);
  }
});