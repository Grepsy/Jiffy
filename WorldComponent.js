var WorldComponent = Component.$extend({
  _world: null,
  _debug: null,

  ratio: 30,
  gravity: { x: 0, y: 9.81 },

  __init__: function (ratio, gravity) {
    this.onFrame = bind(this.onFrame, this);
    this.onFrameDebug = bind(this.onFrameDebug, this);

    var gravity = new Box2D.Common.Math.b2Vec2(this.gravity.x, this.gravity.y);
    this._world = new Box2D.Dynamics.b2World(gravity, true);
  },

  debug: function (canvas) {
    this._debug = new Box2D.Dynamics.b2DebugDraw();
    this._debug.SetSprite(canvas.getContext('2d'));
    this._debug.SetDrawScale(this.ratio);
    this._debug.SetFillAlpha(0.3);
    this._debug.SetLineThickness(1.0);
    this._debug.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
    this._world.SetDebugDraw(this._debug);

    this.container.addListener('frame', this.onFrameDebug);
  },

  onReady: function () {
    this.container.addListener('frame', this.onFrame);
    this.fps = this.container.getComponent('timer').fps;
  },

  onFrame: function () {
    log('Stepping world');
    this._world.Step(1 / this.fps, 10, 10, true);
    this._world.ClearForces();
  },

  onFrameDebug: function () {
    this._world.DrawDebugData();
  }
});