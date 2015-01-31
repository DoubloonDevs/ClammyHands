var canvas = document.getElementById('myCanvas'),
  c = canvas.getContext('2d'),
  build = "Build 1.0.7";

canvas.width = 1280;
canvas.height = 720;

var width,
  height,
  scale = 1,
  shake = false,
  worldX = 0,
  worldY = 0;

var game_start = true,
  game_over = false,
  game_paused = false,
  paused = 0,
  loaded = true,
  unlock_turret = false,
  turret_deployed = false,
  kills = 0;

var doritos_power = false,
  dew_power = false;
  sanic_power = false;

var spawn_timer = 160,
  spawn_time = 60,
  power_up_timer = 0,
  mountdew_timer = 2400,
  health_timer = 1200,
  sanic_timer = 1500,
  doritos_timer = 600;

var mouseDown = false,
  mouseX = canvas.width / 2,
  mouseY = canvas.height / 2;

var upPressed = false,
  leftPressed = false,
  downPressed = false,
  rightPressed = false;

var dampening = 0.875;

var showhitboxes = false,
  showfps = true;

var player,
  turret,
  drops = [],
  particles = [],
  enemies = [],
  bullets = [];

var lastCalledTime;
var fps;
var delta;

function requestAnimFrame() {
  if (!lastCalledTime) {
    lastCalledTime = Date.now();
    fps = 0;
    return;
  }
  delta = (new Date().getTime() - lastCalledTime) / 1000;
  lastCalledTime = Date.now();
  fps = 1 / delta;
}

window.addEventListener('load', function setup() {
  width = canvas.width;
  height = canvas.height;
  
  player = new Player(200, 200, 85, 85);
  turret = new Turret(random(30, width - 30), random(30, height - 30), 65, 21);

  snooptrain.play();

  resize();
  loaded = true;
}, false);

snooptrain.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

function draw(e) {
  c.save();
  if (game_start == true && !game_over && !game_paused) update();
  c.scale(scale, scale);

  c.translate(worldX, worldY);
  c.drawImage(background, 0, 0, width, height);

  for (var j = enemies.length - 1; j >= 0; j--) {
    var en = enemies[j];
    if (!game_over && !game_paused) en.update();
    en.display();
    if (!en.alive) enemies.splice(j, 1);
    var disX = player.x - en.x;
    var disY = player.y - en.y;
    if (Math.sqrt((disX * disX) + (disY * disY)) < player.width) {
      collisionBetween(en, player);
    }
  }
  for (var i = bullets.length - 1; i >= 0; i--) {
    var b = bullets[i];
    if (!game_over && !game_paused) b.update();
    b.display();
    if (!b.alive) bullets.splice(i, 1);
  }
  for (var a = drops.length - 1; a >= 0; a--) {
    var d = drops[a];
    if (!game_over && !game_paused) d.update();
    d.display();
    if (!d.alive) drops.splice(a, 1);
  }

  player.display();
  if (turret_deployed == true) {
    turret.display();
    turret.update();
    bullets.push(new Bullet(turret, 25, 15, "pringles", 20));
  }

  c.fillStyle = 'red';
  c.fillText('Skrubs rekt : ' + kills, 5, 20);
  c.fillText('Snoops snooping : ' + enemies.length, 5, 35);
  c.fillText(Math.round(player.health) + "/10 -IGN", 5, 50)
  c.fillStyle = 'rgb(0, 255, 0)';
  c.fillText(build, 5, 65);
  if (showfps) c.fillText("fps : " + Math.floor(fps), 5, 80);

  if (game_over) {
    gofast.pause();
    combo.pause();
    snooptrain.pause();
    sad_violin.play();
    c.fillStyle = 'rgba(0, 0, 0, 0.5)';
    c.fillRect(0, 0, width, height);
    c.fillStyle = 'rgba(255, 255, 255, 0.65)';
    c.font = '32pt Comic Sans MS';
    c.textAlign = "center";
    c.fillText("u rekt " + kills + " scrubs", width / 2, height / 2 - 23);
    c.fillText("1 skrub rekt u", width / 2, height / 2 + 23);
  }
  if (paused % 2 == 1 && !game_over) {
    c.fillStyle = 'rgba(0, 0, 0, 0.5)';
    c.fillRect(0, 0, width, height);
    c.fillStyle = 'rgba(255, 255, 255, 0.65)';
    c.font = '32pt Comic Sans MS';
    c.textAlign = "center";
    c.fillText("paused", width / 2, height / 2);
    game_paused = true;
    snooptrain.pause();
  } else {
    game_paused = false;
  }
  if (!game_paused && !game_over && power_up_timer < 1) {
    snooptrain.play();
  }
  c.drawImage(spr_cursor, canvas.mouseX, canvas.mouseY, 25, 25);
  c.restore();
}
if (loaded) setInterval(draw, 1000 / 60);

function update() {
  requestAnimFrame();
  arrayCollision(bullets, enemies);
  handlePowerups();
  if (spawn_timer < 1) {
    enemies.push(new Enemy(random(200, width - 200), random(600, height - 600), 45, 45));
    spawn_timer = spawn_time;
  }
  spawn_timer--;
  player.update();
  if (player.health < 1) {
    game_over = true;
    player.health = 0;
  }
  if (spawn_time > 10) spawn_time -= 0.005;

  if (worldX < 0) worldX += 5;
  if (worldX > 0) worldX -= 5;
  if (worldY < 0) worldY += 5;
  if (worldY > 0) worldY -= 5;
  if (!shake) {
    worldX = 0;
    worldY = 0;
  }
}

function handlePowerups() {
  if (mouseDown) {
    if (power_up_timer < 1) {
      bullets.push(new Bullet(player, 25, 15, "chicken", 20));
    }
    if (doritos_power == true && power_up_timer > 1) {
      bullets.push(new Bullet(player, 20, 20, "doritos", 10));
      bullets.push(new Bullet(player, 10, 10, "doritos", 15));
    }
    if (dew_power == true && power_up_timer > 1) {
      bullets.push(new Bullet(player, 30, 15, "mountdew", 17));
    }
    if (sanic_power == true && power_up_timer > 1) {
      player.speed = 40;
      bullets.push(new Bullet(player, 20, 20, "ring", 40));
    }
  }
  if (power_up_timer > -1) {
    power_up_timer--;
  } else if (power_up_timer < 1) {
    doritos_power = false;
    dew_power = false;
    sanic_power = false;
    player.speed = 5;
    shake = false;
    combo.pause();
    gofast.pause();
    snooptrain.play();
  }
  doritos_timer--;
  if (doritos_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 50, 60, "doritos"));
    doritos_timer = 1600;
  }
  mountdew_timer--;
  if (mountdew_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 50, 25, "mountdew"));
    mountdew_timer = 1600 * 3;
  }
  health_timer--;
  if (health_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 35, 45, "health"));
    health_timer = 1600;
  }
  sanic_timer--;
  if (sanic_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 86, 50, "sanic"));
    sanic_timer = 1600 * 4;
  }
  if (power_up_timer > 1 && shake) {
    worldX = random(-20, 20);
    worldY = random(-20, 20);
  }
}

function give_doritos(time) {
  doritos_power = true;
  power_up_timer = time;
}
function give_dew(time) {
  dew_power = true;
  power_up_timer = time;
}
function give_sanic(time) {
  sanic_power = true;
  power_up_timer = time;
}

function Player(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.hx = this.x;
  this.hy = this.y;
  this.velx = 0;
  this.vely = 0;
  this.width = w;
  this.height = h;
  this.speed = 5;
  this.angle = 0;
  this.kills = 0;
  this.health = 10;
  this.behaviour = 'player';
}
Player.prototype.control = function() {
  if (leftPressed && this.velx > -this.speed) this.velx--;
  if (rightPressed && this.velx < this.speed) this.velx++;
  if (upPressed && this.vely > -this.speed) this.vely--;
  if (downPressed && this.vely < this.speed) this.vely++;
};
Player.prototype.update = function() {
  this.x += this.velx;
  this.y += this.vely;
  this.velx *= dampening;
  this.vely *= dampening;
  this.dx = canvas.mouseX - (this.x);
  this.dy = canvas.mouseY - (this.y);
  this.angle = Math.atan2(this.dy, this.dx);
  this.control();
  this.hx = this.x - (this.width / 2);
  this.hy = this.y - (this.height / 2);
};
Player.prototype.display = function() {
  c.fillStyle = 'rgba(255, 0, 0, 0.5)';
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  if (showhitboxes) c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  c.drawImage(spr_player, -this.width / 2, -this.height / 2, this.width, this.height);
  c.restore();
};

function Turret(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.health = 55;
  this.dx = 0;
  this.dy = 0;
}
Turret.prototype.update = function() {
  if (enemies.length >= 1) {
    this.dx = enemies[enemies.length - 1].x - (this.x);
    this.dy = enemies[enemies.length - 1].y - (this.y);
  }
  this.angle = Math.atan2(this.dy, this.dx);
  if (this.health < 1) this.alive = false;
};
Turret.prototype.display = function() {
  c.fillStyle = 'rgba(255, 0, 0, 0.5)'
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  if (showhitboxes) c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  c.drawImage(spr_turret, -this.width / 2, -this.height / 2, this.width, this.height);
  c.restore();
};

function Drop(x, y, w, h, type) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.type = type;
  this.alive = true;
}
Drop.prototype.update = function() {
  var disX = player.x - this.x;
  var disY = player.y - this.y;
  if (Math.sqrt((disX * disX) + (disY * disY)) < player.width) {
    if (this.type == "doritos") give_doritos(700);
    if (this.type == "mountdew") give_dew(700);
    if (this.type == "sanic") {
      gofast.currentTime = 0;
      if (combo.currentTime === 0) gofast.play();
      give_sanic(700);
      snooptrain.pause();
    }
    if (this.type == "health") {
      player.health = 10;
      mario_up.play();
    }
    if (doritos_power && this.type == "mountdew" || dew_power && this.type == "doritos") {
      power_up_timer = 1200;
      combo.currentTime = 0;
      combo.play();
      wow.play();
      gofast.pause();
      shake = true;
      snooptrain.pause();
    }
    this.alive = false;
  }
};
Drop.prototype.display = function() {
  c.save();
  c.translate(this.x, this.y);
  if (this.type == "doritos") c.drawImage(spr_doritos_bag, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "mountdew") c.drawImage(spr_mountdew, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "health") c.drawImage(spr_health, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "sanic") c.drawImage(spr_sanic, -this.width / 2, -this.height / 2, this.width, this.height);
  c.restore();
};

function Particle(x, y, size, dither) {
  this.x = x;
  this.y = y;
  this.dither = dither;
  this.size = size;
  this.velx = Math.random() * (-dither - dither) + dither;
  this.vely = Math.random() * (-dither - dither) + dither;
  this.momentum = 0;
  this.health = 5;
}
Particle.prototype.isDead = function() {
  if (this.health < 0) {
    return true;
  } else {
    return false;
  }
};
Particle.prototype.update = function () {
  this.x += this.velx;
  this.y += this.vely;
  this.velx *= dampening;
  this.vely += 0.3;
  this.health--;
};
Particle.prototype.display = function () {
  c.opacity = 0.1;
  c.fillStyle = "rgba(51, 151, 255, 0.5)";
  c.fillRect(this.x, this.y, this.size, this.size);
};

function Bullet(parent, w, h, type, s) {
  this.x = parent.x;
  this.y = parent.y;
  this.width = w;
  this.height = h;
  this.type = type;
  if (this.type == "chicken") {
    this.velx = (Math.cos(parent.angle) * s) + random(-1, 1);
    this.vely = (Math.sin(parent.angle) * s) + random(-1, 1);
  } else if (this.type == "doritos") {
    this.velx = (Math.cos(parent.angle) * s) + random(-5, 5);
    this.vely = (Math.sin(parent.angle) * s) + random(-5, 5);
  } else if (this.type == "pringles") {
    this.velx = (Math.cos(parent.angle) * s) + random(-2, 2);
    this.vely = (Math.sin(parent.angle) * s) + random(-2, 2);
  } else if (this.type == "mountdew") {
    this.velx = (Math.cos(parent.angle) * s) + random(-6, 6);
    this.vely = (Math.sin(parent.angle) * s) + random(-4, 4);
  } else if (this.type == "ring") {
    this.velx = (Math.cos(parent.angle) * s) + random(-6, 6);
    this.vely = (Math.sin(parent.angle) * s) + random(-4, 4);
  }
  this.angle = parent.angle;
  this.health = 1;
  this.alive = true;
  this.behaviour = 'bullet';
}
Bullet.prototype.update = function() {
  this.x += this.velx;
  this.y += this.vely;
  if (this.x > width || this.y > height || this.x < 0 || this.y < 0) this.alive = false;
};
Bullet.prototype.display = function() {
  c.fillStyle = 'black';
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  if (this.type == "chicken") c.drawImage(spr_chicken, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "doritos") c.drawImage(spr_doritos, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "pringles") c.drawImage(spr_pringle, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "mountdew") c.drawImage(spr_dew_can, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "ring") c.drawImage(spr_ring, -this.width / 2, -this.height / 2, this.width, this.height);
  c.restore();
};

function Enemy(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.hx = this.x;
  this.hy = this.y;
  this.velx = 0;
  this.vely = 0;
  this.width = w;
  this.height = h;
  this.speed = 4;
  this.angle = 0;
  this.alive = true;
  this.health = 15;
  this.behaviour = 'enemy';
}
Enemy.prototype.update = function() {
  this.x += this.velx;
  this.y += this.vely;
  this.velx *= dampening;
  this.vely *= dampening;
  this.velx += Math.cos(this.angle) / 2;
  this.vely += Math.sin(this.angle) / 2;
  this.dx = player.x - (this.x);
  this.dy = player.y - (this.y);
  this.angle = Math.atan2(this.dy, this.dx);
  if (this.health < 1) {
    kills++;
    this.alive = false;
  }
};
Enemy.prototype.display = function() {
  c.fillStyle = 'rgba(255, 0, 0, 0.5)'
  c.save();
  c.scale(-1, -1);
  c.translate(-this.x, -this.y);
  c.rotate(this.angle);
  if (showhitboxes) c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  c.drawImage(spr_enemy, -this.width / 2, -this.height / 2, this.width, this.height);
  c.restore();
};

function arrayCollision(arrayA, arrayB) {
  for (var i = 1; i < arrayA.length; i++) {
    var this1 = arrayA[i];
    for (var j = 0; j < arrayB.length; j++) {
      var this2 = arrayB[j];
      var disX = this2.x - this1.x;
      var disY = this2.y - this1.y;
      if (Math.sqrt((disX * disX) + (disY * disY)) < this1.width) {
        collisionBetween(this1, this2);
      }
    }
  }
}

function collisionBetween(shapeA, shapeB) {
  var vX = (shapeA.x) - (shapeB.x),
    vY = (shapeA.y) - (shapeB.y),
    hWidths = (shapeA.width / 2) + (shapeB.width / 2),
    hHeights = (shapeA.height / 2) + (shapeB.height / 2),
    colDir = null;

  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    var oX = hWidths - Math.abs(vX),
      oY = hHeights - Math.abs(vY);
    if (oX >= oY) {
      if (vY > 0) {
        colDir = "t";
        shapeA.y += oY;
        if (shapeB.behaviour == 'player') player.health -= 0.05;
        if (shapeA.behaviour == 'bullet') {
          shapeA.alive = false;
          if (shapeA.type == "chicken") shapeB.health -= 2;
          if (shapeA.type == "doritos") shapeB.health -= 2;
          if (shapeA.type == "pringles") shapeB.health -= 1;
          if (shapeA.type == "mountdew") shapeB.health -= 2;
          if (shapeA.type == "ring") shapeB.health -= 2;
          hit.play();
          hit.currentTime = 0;
        }
      } else {
        colDir = "b";
        shapeA.y -= oY;
        if (shapeB.behaviour == 'player') player.health -= 0.05;
        if (shapeA.behaviour == 'bullet') {
          shapeA.alive = false;
          if (shapeA.type == "chicken") shapeB.health -= 2;
          if (shapeA.type == "doritos") shapeB.health -= 2;
          if (shapeA.type == "pringles") shapeB.health -= 1;
          if (shapeA.type == "mountdew") shapeB.health -= 2;
          if (shapeA.type == "ring") shapeB.health -= 2;
          hit.play();
          hit.currentTime = 0;
        }
      }
    } else {
      if (vX > 0) {
        colDir = "l";
        shapeA.x += oX;
        if (shapeB.behaviour == 'player') player.health -= 0.05;
        if (shapeA.behaviour == 'bullet') {
          shapeA.alive = false;
          if (shapeA.type == "chicken") shapeB.health -= 2;
          if (shapeA.type == "doritos") shapeB.health -= 2;
          if (shapeA.type == "pringles") shapeB.health -= 1;
          if (shapeA.type == "mountdew") shapeB.health -= 2;
          if (shapeA.type == "ring") shapeB.health -= 2;
          hit.play();
          hit.currentTime = 0;
        }
      } else {
        colDir = "r";
        shapeA.x -= oX;
        if (shapeB.behaviour == 'player') player.health -= 0.05;
        if (shapeA.behaviour == 'bullet') {
          shapeA.alive = false;
          if (shapeA.type == "chicken") shapeB.health -= 2;
          if (shapeA.type == "doritos") shapeB.health -= 2;
          if (shapeA.type == "pringles") shapeB.health -= 1;
          if (shapeA.type == "mountdew") shapeB.health -= 2;
          if (shapeA.type == "ring") shapeB.health -= 2;
          hit.play();
          hit.currentTime = 0;
        }
      }
    }
  }
  return colDir;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function resize() {
  var canvasRatio = canvas.height / canvas.width;
  var windowRatio = window.innerHeight / window.innerWidth;
  var width;
  var height;

  if (windowRatio < canvasRatio) {
    height = window.innerHeight;
    width = height / canvasRatio;
  } else {
    width = window.innerWidth;
    height = width * canvasRatio;
  }

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  if (window.innerWidth >= 1920) {
    canvas.width = 1920;
    canvas.height = 1080;
    scale = 1.5;
    c.font = '13pt Comic Sans MS';
    background.src = 'http://www.hdwallpapers.in/walls/windows_xp_bliss-wide.jpg';
  } else if (window.innerWidth <= 1280 && fps > 30) {
    canvas.width = 1280;
    canvas.height = 720;
    scale = 1;
    c.font = '13pt Comic Sans MS';
    background.src = 'http://www.wallpaperfo.com/thumbnails/detail/20120429/bliss%20windows%20xp%20kermit%20the%20frog%20microsoft%20windows%20the%20muppet%20show%201920x1440%20wallpaper_www.wallpaperfo.com_46.jpg';
  } else if (fps <= 30) {
    canvas.width = 640;
    canvas.height = 360;
    scale = 0.5;
    c.font = '15pt Comic Sans MS';
    background.src = 'http://www.wallpaperfo.com/thumbnails/detail/20120429/bliss%20windows%20xp%20kermit%20the%20frog%20microsoft%20windows%20the%20muppet%20show%201920x1440%20wallpaper_www.wallpaperfo.com_46.jpg';
  }
};
window.addEventListener('resize', resize, false);
