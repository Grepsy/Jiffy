/*jslint white: true, browser: true, devel: true, debug: true, evil: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*global window Base base2 Function2 Box2D EventTarget */

eval(base2.namespace);
eval(base2.JavaScript.namespace);

var Sprite = Base.extend({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    angle: 0,
    parent: null,
    children: null,
    ctx: null,

    _display: null,
    get display() { return this._display; },
    set display(val) {
        for (var i = 0, l = this.children.length; i < l; i++) {
            this.children[i].display = val;
        }
        this._display = val;
    },

    constructor: function (width, height) {
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

var Display = Sprite.extend({
    settings: null,
    timer: null,

    constructor: function (ele, timer, options) {
        this.onFrame = Function2.bind(this.onFrame, this);
        this.timer = timer;

        options = options || {};
        var canvas,
            defaults = {
            width: 300,
            height: 300
        };

        this.settings = new Base(defaults).extend(options);
        this.base(this.settings.width, this.settings.height);

        ele.parentNode.replaceChild(this.ctx.canvas, ele);
        this.timer.addListener('frame', this.onFrame);
    },

    onFrame: function () {
        this.ctx.clearRect(0, 0, this.settings.width, this.settings.height);
        this.draw(this);
    },

    draw: function (obj) {
        this.ctx.save();
        this.ctx.translate(obj.x, obj.y);
        this.ctx.rotate(obj.angle);
        this.ctx.drawImage(obj.ctx.canvas, -obj.width / 2, -obj.height / 2);
        for (var i = 0, e = obj.children.length; i < e; i++) {
            this.draw(obj.children[i]);
        }
        this.ctx.restore();
    }
});

var Animation = Sprite.extend({
    frame: 0,
    image: null,
    frames: 0,
    looping: true,
    running: false,
    display: null,

    constructor: function (imageurl, width, height, timer) {
        this.base(width, height);
        this.onFrame = Function2.bind(this.onFrame, this);
        this.onAnimationLoaded = Function2.bind(this.onAnimationLoaded, this);

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

var World = Base.extend({
    _world: null,
    _timer: null,
    _debug: null,

    settings: null,
    defaults: {
        ratio: 30,
        gravity: { x: 0, y: 0.8 }
    },

    constructor: function (timer, options) {
        options = options || {};
        this.settings = new Base(defaults).extend(options);

        var gravity = new Box2D.Common.Math.b2Vec2(this.settings.gravity.x, this.settings.gravity.y);
        this._world = Box2D.Dynamics.b2World(gravity, true);
        this._timer = timer;

        this._timer.addListener('frame', onFrame);
    },

    debug: function (canvas) {
        this._debug = new b2DebugDraw();
        this._debug.SetSprite(canvas.getContext('2d'));
        this._debug.SetDrawScale(this.RATIO);
        this._debug.SetFillAlpha(0.3);
        this._debug.SetLineThickness(1.0);
        this._debug.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this._world.SetDebugDraw(debugDraw);
        this._timer.addListener('frame', onFrame);
    },

    onFrame: function () {
        this._world.Step(1 / this.timer.fps, 8, 8, true);
        this._world.ClearForces();
    },

    onFrameDebug: function () {
        this._world.DrawDebugData();
    }
});

var Physics = Base.extend({
    sprite: null,
    world: null,
    timer: null,
    body: null,

    constructor: function (sprite, world, clock) {
        this.sprite = sprite;
        this.world = world;
        this.clock = clock;
        this.onFrame = Function2.bind(this.onFrame, this);

        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.position.x = (this.sprite.x + this.sprite.width / 2) / this.RATIO;
        bodyDef.position.y = (this.sprite.y + this.sprite.height / 2) / this.RATIO;

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = 0.1;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.9;
        fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape(this.width / 2 / this.RATIO);
        //fixtureDef.shape.SetAsBox(this.width / 2 / this.RATIO, this.height / 2 / this.RATIO);

        this.body = this.world.CreateBody(bodyDef);
        this.body.CreateFixture(fixtureDef);

        this.timer.addListener('frame', this.onFrame);
    },

    onFrame: function () {
        this.sprite.x = this.body.GetPosition().x * this.RATIO;
        this.sprite.y = this.body.GetPosition().y * this.RATIO;
        this.sprite.angle = this.body.GetAngle();
    }
});

var Box = Sprite.extend({
    constructor: function (width, height) {
        this.base(width, height);
        this.ctx.fillStyle = 'rgba(255, 0, 0, 128)';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
});

var FrameTimer = EventTarget.extend({
    _timer: null,
    _stats: null,

    settings: null,
    defaults: {
        fps: 30
    }

    constructor: function(options) {
        options = options || {};
        this.settings = new Base(defaults).extend(options);
    },

    start: function () {
        var frame = 0;
        this._stats = window.setInterval(function () {
            console.log('FPS: ', frame);
            frame = 0;
        }, 1000);

        this._timer = window.setInterval(function () {
            this.fire('frame');
            frame++;
        }, 1000 / this.settings.fps);
    },

    stop: function () {
        window.clearInterval(this._timer);
        window.clearInterval(this._stats);
    }
});

function test() {
    var screen = new Display(document.getElementById('game'), { width: 400, height: 400 });

    var fixDef = new b2FixtureDef();
    fixDef.density = -0.2;
    fixDef.friction = 0.6;
    fixDef.restitution = 0.9;

    var bodyDef = new b2BodyDef();
    //create ground
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 9;
    bodyDef.position.y = 13;
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(10, 0.5);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    //walls
    bodyDef.position.x = 0;
    bodyDef.position.y = 15;
    fixDef.shape.SetAsBox(0.5, 10);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.x = 14;
    world.CreateBody(bodyDef).CreateFixture(fixDef);

    for (var i=0; i < 10; i++) {
        var bb = new Animation("sphere.png", 64, 64);
        bb.y = r(10) + 20;
        bb.x = r(400);
        var wr = new PhysicsWrapper(bb, world);
        screen.root.add(wr);
    }

    var game = new Game(screen, world);
    game.start();

    document.body.addEventListener('click', function () {
        game.pause();
    }, false);
}

function r(max) {
    return Math.floor(Math.random() * max);
}

window.setTimeout(test, 500);