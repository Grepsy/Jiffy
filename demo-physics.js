function demo() {
	var timer = new FrameTimer();
	var ele = document.getElementById('demo');
    var display = new Display(ele, timer, { width: 500, height: 500 });
	var world = new World(timer);
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

    for (var i = 0; i < 4; i++) {
        var ball = new Animation("assets/sphere.png", 64, 64, timer);
        ball.x = Math.random(500);
		ball.y = 32;
        display.add(ball);
    }

    timer.start({fps: 30});
}

window.addEventListener('load', demo, false);
