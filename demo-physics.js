function demo() {
  var timer = new FrameTimer(25);
  var ele = document.getElementById('demo');
  var debug = document.getElementById('demo-debug');

  var world = new World(timer);
  var display = new Display(ele, 300, 300, timer);
  //world.debug(debug);

  var ground = new PBox(0, 290, 300, 10, world, true);
  var wall = new PBox(0, 0, 10, 300, world, true);
  display.add(ground);
  display.add(wall);

  box = new PBox(140, 20, 40, 40, world, false);
  box.angle = 2;
  display.add(box);

  window.setInterval(function() {
    var box = new PBox(Math.random() * 250, Math.random() * 20, 20, 20, world, false);
    display.add(box);
  }, 300);

  timer.start();
}

window.addEventListener('load', demo, false);
