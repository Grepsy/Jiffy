function demo() {
  var ele = document.getElementById('demo');
  var debug = document.getElementById('demo-debug');

  var timer = new Timer(15);
  var world = new WorldComponent();
  var display = new GameObject('display', new DisplayComponent(ele), new SizeComponent(300, 300));
  //world.debug(debug);

  var ground = new GameObject('ground', new PositionComponent(0, 290), new SizeComponent(300, 10), new BoxComponent(), new PhysicsComponent(world, true));
  var wall = new GameObject('wall', new PositionComponent(0, 0), new SizeComponent(10, 300), new BoxComponent(), new PhysicsComponent(world, true));

  display.add(ground);
  display.add(wall);

  log('creating demo')
  demo = new Game(timer, [ display , ground, wall ]);

  timer.onFrame();
  // demo.add(ground);
  // demo.add(wall);

  // window.setInterval(function() {
  // log('creating box')
  // var box = new GameObject(new PositionComponent(Math.random() * 250, 20), new SizeComponent(20, 20), new BoxComponent(), new PhysicsComponent(world, false))
  // demo.add(box);
  // }, 400);

  //timer.start();

}

window.addEventListener('load', demo, false);
