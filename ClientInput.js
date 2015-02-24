var canvas = document.getElementById("myCanvas");
document.onkeydown = keyPressed;
function keyPressed(e) {
  e = e || window.event;
  if (e.keyCode == 87) upPressed = true;
  if (e.keyCode == 65) leftPressed = true;
  if (e.keyCode == 83) downPressed = true;
  if (e.keyCode == 68) rightPressed = true;
}
document.onkeyup = keyReleased;
function keyReleased(e) {
  e = e || window.event;
  if (e.keyCode == 87) upPressed = false;
  if (e.keyCode == 65) leftPressed = false;
  if (e.keyCode == 83) downPressed = false;
  if (e.keyCode == 68) rightPressed = false;
  if (e.keyCode == 27) paused++;
  if (e.keyCode == 32 && kills > 49 && !turret_deployed) {
    turret.x = player.x;
    turret.y = player.y;
    turret_deployed = true;
  }
  if (e.keyCode == 77) mute++;
}

document.ontouchstart = touchStart;
function touchStart(e){
  e.preventDefault();
  mouseX = e.pageX;
  mouseY = e.pageY;
  mouseDown = true;
}
document.ontouchmove = touchMove;
function touchMove(e){
  e.preventDefault();
  mouseX = e.pageX;
  mouseY = e.pageY;
  mouseDown = true;
}
document.ontouchend = touchEnd;
function touchEnd(e) {
  e = e || window.event;
  e.preventDefault();
  mouseX = e.pageX;
  mouseY = e.pageY;
  mouseDown = false;
}

document.onmousedown = mousePressed;
function mousePressed(e) {
  mouseDown = true;
}
document.onmouseup = mouseReleased;
function mouseReleased(e) {
  mouseDown = false;
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

canvas.addEventListener('mousemove', function(evt) {
  var mousePos = getMousePos(canvas, evt);
  this.mouseX = mousePos.x;
  this.mouseY = mousePos.y;
  mouseX = evt.pageX;
  mouseY = evt.pageY;
}, true);
