function demo() {
  var ele = document.getElementById('demo');
  var debug = document.getElementById('demo-debug');

  var timer = new TimerComponent(0.2);
  var world = new WorldComponent();
  var display = new DisplayComponent(ele);
  //world.debug(debug);

  var ground = new GameObject(new PositionComponent(0, 190), new SizeComponent(300, 10), new BoxComponent(), new PhysicsComponent(world, true));
  var wall = new GameObject(new PositionComponent(0, 0), new SizeComponent(10, 300), new BoxComponent(), new PhysicsComponent(world, true));

  demo = new GameObject(display, world, timer);
  demo.add(ground);
  demo.add(wall);

  // window.setInterval(function() {
    var box = new GameObject(new PositionComponent(Math.random() * 250, Math.random() * 20), new SizeComponent(20, 20), new BoxComponent(), new PhysicsComponent(world, false))
    demo.add(box);
  // }, 400);

  timer.start();
  //timer.onFrame();
}

window.addEventListener('load', demo, false);
