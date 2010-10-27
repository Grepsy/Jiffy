function demo() {
	var timer = new FrameTimer();
	var ele = document.getElementById('demo');
    var display = new Display(ele, timer, { width: 500, height: 500 });
	var world = new World(timer);

	var ground = new PSprite(500, 10, world, timer);
	ground.y = 490;

    for (var i = 0; i < 4; i++) {
        var box = new PBox(64, 64, world);
        box.x = Math.random(500);
		box.y = 32;
        display.add(box);
    }

    timer.start();
}

window.addEventListener('load', demo, false);
