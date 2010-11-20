function demo() {
  var timer = new Timer();
  var ele = document.getElementById('demo');
  var display = new Display(ele, 256, 64, timer);

  for (var i = 0; i < 4; i++) {
    var ball = new Animation("assets/sphere.png", 64, 64, timer);
    ball.x = i * 40 + 32;
    ball.y = 32;
    display.add(ball);
  }

  timer.start();
}

window.addEventListener('load', demo, false);
