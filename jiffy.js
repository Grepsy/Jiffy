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
		this.display = this;
    },

    onFrame: function () {
        this.ctx.clearRect(0, 0, this.settings.width, this.settings.height);
        this.draw(this);
    },

    draw: function (obj) {
        this.ctx.save();
        this.ctx.translate(obj.x, obj.y);
        this.ctx.rotate(obj.angle);
		//console.log(obj.ctx.canvas , -obj.width / 2, -obj.height / 2);
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
		this.timer = timer;
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

var World = Base.extend({
    _world: null,
    _timer: null,
    _debug: null,

	ratio: 30,
    gravity: { x: 0, y: 0.8 },
    
    constructor: function (timer, ratio, gravity) {
        var gravity = new Box2D.Common.Math.b2Vec2(this.gravity.x, this.gravity.y);
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
        this._timer.addListener('frame', onFrameDebug);
    },

    onFrame: function () {
        this._world.Step(1 / this.timer.fps, 8, 8, true);
        this._world.ClearForces();
    },

    onFrameDebug: function () {
        this._world.DrawDebugData();
    }
});

var PSprite = Sprite.extend({
	_b2body: null,
	
    world: null,
	get x()    		        { return this._b2body.position.x * this.world.ratio - this.width / 2; },
	set x(val) 		        { this._b2body.position.x = (val + this.width / 2) / this.world.ratio; },
	get y()    		        { return this._b2body.position.y * this.world.ratio - this.width / 2; },
	set y(val) 		        { this._b2body.position.y = (val + this.height / 2) / this.world.ratio; },
	get angle() 	        { return this._b2body.angle; },
	get density() 	        { return this._b2body.density; },
	set density(val)        { this._b2body.density = val; },
	get friction() 	        { return this._b2body.friction; },
	set friction(val)       { this._b2body.friction = val; },
	get restitution()       { return this._b2body.restitution; },
	set restitution(val)    { this._b2body.restitution = val; },
	_isStatic: true,

    constructor: function (width, height, world) {
        this.parent(width, height);
		this.world = world;
        
        this.createBody();
    },

	createBody: function() {
		var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
		
        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = 0.5;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.5;
    	fixtureDef.shape = new b2PolygonShape();
        //fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape(this.width / 2 / this.RATIO);
        fixtureDef.shape.SetAsBox(this.width / 2 / this.world.ratio, this.height / 2 / this.world.ratio);

        this._b2body = this.world._b2world.CreateBody(bodyDef);
        this._b2body.CreateFixture(fixtureDef);
	}
});

var Box = Sprite.extend({
    constructor: function (width, height) {
        this.base(width, height);
        this.ctx.fillStyle = 'rgba(255, 0, 0, 128)';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
});

var PBox = PSprite.extend({
    constructor: function (width, height, world) {
        this.base(width, height, timer);
        this.ctx.fillStyle = 'rgba(255, 0, 0, 128)';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
});

var FrameTimer = EventTarget.extend({
    _timer: null,
    _stats: null,

    settings: null,
    fps: 25,

    constructor: function(fps) {
        this.fps = fps || this.fps;
    },

    start: function () {
        var frame = 0,
			that = this;
			
        this._stats = window.setInterval(function () {
            console.log('FPS: ', frame);
            frame = 0;
        }, 1000);

        this._timer = window.setInterval(function () {
            that.fire('frame');
            frame++;
        }, 1000 / this.fps);
    },

    stop: function () {
        window.clearInterval(this._timer);
        window.clearInterval(this._stats);
    }
});