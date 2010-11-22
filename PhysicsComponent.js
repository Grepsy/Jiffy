var PhysicsComponent = Component.$extend({
  _b2body: null,

  world: null,
  get x()               { return this._b2body.GetPosition().x * this.world.ratio; },
  //set x(val)            { this._b2body.GetPosition.x = (val + this.width / 2) / this.world.ratio; },
  get y()               { return this._b2body.GetPosition().y * this.world.ratio; },
  //set y(val)            { this._b2body.GetPosition.y = (val + this.height / 2) / this.world.ratio; },
  get angle()           { return this._b2body.GetAngle(); },
  set angle(val)        { this._b2body.SetAngularVelocity(val); },
  // get density()        { return this._b2body.density; },
  // set density(val)      { this._b2body.density = val; },
  // get friction()         { return this._b2body.friction; },
  // set friction(val)     { this._b2body.friction = val; },
  // get restitution()     { return this._b2body.restitution; },
  // set restitution(val)  { this._b2body.restitution = val; },
  _isStatic: true,

  __init__: function (world, isStatic) {
    this.world = world;
    this.isStatic = isStatic;

    this.onFrame = bind(this.onFrame, this);
  },

  onReady: function() {
    this.createBody();
    this.container.addListener('frame', this.onFrame);
  },

  onFrame: function() {
    this.container.x = this.x;
    this.container.y = this.y;
    this.container.angle = this.angle;
  },

  createBody: function() {
    var bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.position.x = (this.container.x + this.container.width / 2) / this.world.ratio;
    bodyDef.position.y = (this.container.y + this.container.height / 2) / this.world.ratio;
    bodyDef.type = this.isStatic ? Box2D.Dynamics.b2Body.b2_staticBody : Box2D.Dynamics.b2Body.b2_dynamicBody;

    var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.density = 1;
    fixtureDef.friction = 0.3;
    fixtureDef.restitution = 0.1;
    fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    //fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape(this.width / 2 / this.RATIO);
    fixtureDef.shape.SetAsBox(this.container.width / 2 / this.world.ratio, this.container.height / 2 / this.world.ratio);

    this._b2body = this.world._world.CreateBody(bodyDef);
    this._b2body.CreateFixture(fixtureDef);
  }
});