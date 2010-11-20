function demo() {
  var timer = new Timer(10);
  var ele = document.getElementById('demo');
  var display = new Display(ele, 256, 256, timer);

  var bun = new Animation("assets/dott.png", 19, 16, timer);
  bun.x = 100;
  bun.y = 100;
  display.add(bun);

  timer.start();
}

window.addEventListener('load', demo, false);
