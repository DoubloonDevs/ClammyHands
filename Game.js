var canvas = document.getElementById('myCanvas'),
  c = canvas.getContext('2d'),
  build = "Beta 1.0.9";
  canvas.width = 1280;
  canvas.height = 720;  

var width,
  height,
  mouseX,
  mouseY,
  framecount = 0,
  low_res_mode = false,
  spooky_mode = false,
  scale = 1,
  mute = 0,
  mute_music = 0,
  boolean_particles = 0,
  shake = false,
  worldX = 0,
  worldY = 0;

var game_start = true,
  game_over = false,
  game_paused = false,
  paused = 0,
  loaded = false,
  unlock_turret = false,
  turret_deployed = false,
  kills = 0;

var doritos_power = false,
  dew_power = false,
  diamond_power = false,
  sanic_power = false,
  weed_power = false;

var spawn_timer = 160,
  spawn_time = 60,
  mountdew_timer = 2400,
  dew_power_timer = 0,
  health_timer = 1200,
  sanic_timer = 3000,
  sanic_power_timer = 0,
  diamond_timer = 1600,
  diamond_power_timer = 0,
  doritos_timer = 600,
  doritos_power_timer = 0,
  weed_timer = 1500,
  weed_power_timer = 0;

var mouseDown = false,
  time_null_input = 0,
  mouseX = canvas.width / 2,
  mouseY = canvas.height / 2;

var upPressed = false,
  leftPressed = false,
  downPressed = false,
  rightPressed = false;

var dampening = 0.875;

var shake_scale = 0;

var showhitboxes = false,
  showfps = true;

var player,
  turrets = [],
  turrets_stored = 0,
  health_bar,
  drops = [],
  particles = [],
  enemies = [],
  bullets = [];
  
var alert_boss,
  alert_boss_deployed = false;
  
var gabechat;

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

function setup() {
  canvas.width = 1280;
  canvas.height = 720;
  
  framecount = 0,
  low_res_mode = false,
  spooky_mode = false,
  scale = 1,
  mute = 0,
  mute_music = 0,
  boolean_particles = 0,
  shake = false,
  worldX = 0,
  worldY = 0;

  game_start = true,
  game_over = false,
  game_paused = false,
  paused = 0,
  loaded = false,
  unlock_turret = false,
  turret_deployed = false,
  kills = 0;

  doritos_power = false,
  dew_power = false,
  diamond_power = false,
  sanic_power = false,
  weed_power = false;

  spawn_timer = 160,
  spawn_time = 60,
  mountdew_timer = 2400,
  dew_power_timer = 0,
  health_timer = 1200,
  sanic_timer = 3000,
  sanic_power_timer = 0,
  diamond_timer = 1600,
  diamond_power_timer = 0,
  doritos_timer = 600,
  doritos_power_timer = 0,
  weed_timer = 1500,
  weed_power_timer = 0;

  mouseDown = false,
  time_null_input = 0,
  mouseX = canvas.width / 2,
  mouseY = canvas.height / 2;
  turrets = [],
  turrets_stored = 0,
  health_bar,
  drops = [],
  particles = [],
  enemies = [],
  bullets = [];
  alert_boss_deployed = false;
  sad_violin.pause();
  
  width = canvas.width;
  height = canvas.height;
  c.font = '13pt Comic Sans MS';
  player = new Player(200, 200, 85, 85);
  gabechat = new gabeChat(width - (260/1.25) - 15, height - (28/1.25));
  pl_health_bar = new HealthBar(0, 30, 55, 7);
  resize();
}
setup();

snooptrain.addEventListener('ended', function() {
  this.currentTime = 0;
  this.play();
}, false);

function draw() {
  c.save();
  if (game_start == true && !game_over && !game_paused) update();
  c.scale(scale, scale);
  c.fillStyle = 'black';
  if (!weed_power) c.fillRect(0, 0, width, height);
  c.translate(worldX, worldY);
  if (spooky_mode) {
    c.drawImage(spooky_background, 0, 0, width, height);
  } else {
    c.drawImage(background, 0, 0, width, height);
  }

  for (var j = enemies.length - 1; j >= 0; j--) {
    var en = enemies[j];
    if (!game_over && !game_paused) en.update();
    en.display();
    if (!en.alive) enemies.splice(j, 1);
    if (en.behaviour != 'alert_boss') {
      var disX = player.x - en.x;
      var disY = player.y - en.y;
      if (Math.sqrt((disX * disX) + (disY * disY)) < player.width) {
        collisionBetween(en, player);
      }
    } else {
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
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    p.update();
    p.display();
    if (p.alive == false) {
      particles.splice(i, 1);
    }
  }
  for (var i = 0; i < turrets.length; i++) {
    var t = turrets[i];
    t.update();
    t.display();
    if (t.alive == false) {
      turrets.splice(i, 1);
    }
  }
  player.display();

  c.fillStyle = 'red';
  c.fillText('Skrubs rekt : ' + kills, 5, 20);
  c.fillText('Snoops snooping : ' + enemies.length, 5, 35);
  c.fillText(Math.round(player.health) + "/10 -IGN", 5, 50);
  c.fillStyle = 'rgb(0, 255, 0)';
  c.fillText(build, 5, 65);
  if (showfps) c.fillText("fps : " + Math.floor(fps), 5, 80);

  pause_menu();

  gabechat.display();
  gabechat.update();
  mouseX = canvas.mouseX;
  mouseY = canvas.mouseY;
  if (game_start == false) {
    c.fillStyle = 'rgba(0, 0, 0, 0.5)';
    c.fillRect(0, 0, width, height);
  }
  if (weed_power && !game_paused && !game_over) {
    c.fillStyle = 'rgba(0, 240, 10, 0.5);'
    c.fillRect(0, 0, width, height);
  }
  c.restore();
  c.save();
  c.scale(scale, scale);
  if (game_start && !game_paused && !game_over) c.drawImage(spr_cursor, mouseX, mouseY, 25, 25);
  if (time_null_input > 500) {
    c.fillStyle = 'rgb(255, 255, 255)';
    c.font = '42pt Comic Sans MS';
    c.textAlign = "center";
    c.fillText("stop camping", width / 2, height / 2);
  }
  c.restore();
}
setInterval(draw, 1000 / 60);

function update() {
  requestAnimFrame();
  arrayCollision(bullets, enemies);
  handlePowerups();
  handleBosses();
  if (spawn_timer < 1) {
    enemies.push(new Enemy(random(200, width - 200), random(600, height - 600), 45, 45, 'enemy'));
    spawn_timer = spawn_time;
  }
  spawn_timer--;
  player.update();
  if (player.health < 0) {
    game_over = true;
    player.health = 0;
  }
  if (spawn_time > 5) spawn_time -= 0.005;
  /*if (fps <= 30) {
    //low_res_mode = true;
  //}*/
  if (kills == 50) {
    turrets_stored++;
    kills = 51;
  }
  if (kills % 200 === 0 && kills > 1) {
    kills++;
    turrets_stored++;
  }
  var spook_spooked = false;
  if (kills >= 100 && kills <= 200) {
    spooky_mode = true;
    spawn_time = 5;
  } else {
    if (kills >= 201 && kills <= 202) spawn_time = 21;
    spooky_mode = false;
  }
  if (time_null_input > 500) {
    shake_scale += 0.5;
  }
  time_null_input++;
  framecount++;
}

function pause_menu() {
  // Visuals
  // Pause
  if (paused % 2 == 1 && !game_over) {
    c.fillStyle = 'rgba(0, 0, 0, 0.5)';
    c.fillRect(0, 0, width, height);
    c.fillStyle = 'rgba(0, 0, 0, 0.25)';
    c.fillRect(width/2-200, 5, 400, height-10);
    c.fillStyle = 'rgb(255, 255, 255)';
    c.font = '32pt Comic Sans MS';
    c.textAlign = "center";
    c.fillText("Game Paused", width / 2, 50);
    c.font = '16pt Comic Sans MS';
    c.fillText("Sound", width / 2, 90);
    c.fillText("Graphics", width / 2, 230);
    game_paused = true;
    snooptrain.pause();
  } else {
    game_paused = false;
    mouseX = canvas.mouseX;
    mouseY = canvas.mouseY;
  }
  // Game Over
  if (game_over) {
    gofast.pause();
    combo.pause();
    snooptrain.pause();
    sad_violin.play();
    c.fillStyle = 'rgba(0, 0, 0, 0.5)';
    c.fillRect(0, 0, width, height);
    c.fillStyle = 'rgba(0, 0, 0, 0.25)';
    c.fillRect(width/2 - 200, 5, 400, height - 10);
    c.fillStyle = 'rgb(255, 255, 255)';
    c.font = '32pt Comic Sans MS';
    c.textAlign = "center";
    c.fillText("u rekt " + kills + " scrubs", width / 2, height / 2 - 30);
    c.fillText("1 skrub rekt u", width / 2, height / 2 + 16);
  }
  // CSS
  if (game_paused) {
    toggle_music.style.zIndex = 1;
    toggle_all.style.zIndex = 1;
    toggle_particles.style.zIndex = 1;
    canvas.style.cursor = 'default';
  } else {
    toggle_music.style.zIndex = -1;
    toggle_all.style.zIndex = -1;
    toggle_particles.style.zIndex = -1;
    canvas.style.cursor = 'none';
  }
  if (game_over) {
    restart.style.zIndex = 1;
    canvas.style.cursor = 'default';
  } else {
    restart.style.zIndex = -1;
  }
  if (mute % 2 == 1) {
    toggle_all.value = "Mute all: ON";
  } else {
    toggle_all.value = "Mute all: OFF";
  }
  if (mute_music % 2 == 1) {
    toggle_music.value = "Mute music: ON";
  } else {
    toggle_music.value = "Mute music: OFF";
  }
  if (boolean_particles % 2 == 0) {
    toggle_particles.value = "Particles: ON";
  } else {
    toggle_particles.value = "Particles: OFF";
  }

  // Settings
  if (mute % 2 == 1) {
    snooptrain.muted = true;
    gofast.muted = true;
    combo.muted = true;
    wow.muted = true;
    hit.muted = true;
    mario_up.muted = true;
    smash.muted = true;
    weed.muted = true;
  } else {
    snooptrain.muted = false;
    gofast.muted = false;
    combo.muted = false;
    wow.muted = false;
    hit.muted = false;
    mario_up.muted = false;
    smash.muted = false;
    weed.muted = false;
  }
  if (mute_music % 2 == 1) {
    snooptrain.muted = true;
  } else {
    snooptrain.muted = false;
  }
}

function gabeChat(x, y) {
  this.x = x;
  this.y = y;
  this.collapsed = false;
  this.pop_up_count = 0;
}
gabeChat.prototype.update = function() {
  if (kills >= 2 && kills < 25 && this.pop_up_count === 0 && !turret_deployed) {
    this.collapsed = false;
    if (chat.currentTime === 0) chat.play();
    c.textAlign = 'left';
    c.font = '8pt Tahoma';
    c.fillStyle = 'black';
    c.drawImage(spr_gabe_chat_turret, this.x + 7, this.y - 170, 242/1.25, 43/1.25);
    c.fillText("So you think you can meme,", this.x + 45, this.y - 154);
    c.fillText("skrub?", this.x + 45, this.y - 143);
    if (kills >= 5) {
      c.drawImage(spr_gabe_chat_turret, this.x + 7, this.y - 130, 242/1.25, 43/1.25);
      c.fillText("Prove yourself worthy by killing", this.x + 45, this.y - 114);
      c.fillText("these snoops.", this.x + 45, this.y - 103);
    }
    if (kills >= 10) {
      c.drawImage(spr_gabe_chat_turret, this.x + 7, this.y - 90, 242/1.25, 43/1.25);
      c.fillText("Use the WASD keys to move", this.x + 45, this.y - 74);
      c.fillText("yo ass.", this.x + 45, this.y - 63);
    }
    if (kills >= 15) {
      c.drawImage(spr_gabe_chat_turret, this.x + 7, this.y - 50, 242/1.25, 43/1.25);
      c.fillText("Be seeing you soon, ya wee", this.x + 45, this.y - 34);
      c.fillText("scrub.", this.x + 45, this.y - 23);
    }
  } else if (turrets_stored > 0) {
    this.collapsed = false;
    if (chat.currentTime === 0) chat.play();
    c.textAlign = 'left';
    c.font = '8pt Tahoma';
    c.fillStyle = 'black';
    c.drawImage(spr_gabe_chat_turret, this.x + 7, this.y - 170, 242/1.25, 43/1.25);
    c.fillText("Press space to deplay a turret", this.x + 45, this.y - 154);
    c.fillText("you scrub-lord.", this.x + 45, this.y - 143);
  } else {
    this.collapsed = true;
    chat.currentTime = 0;
  }
};
gabeChat.prototype.display = function() {
  c.save();
  c.translate(this.x, this.y);
  if (this.collapsed == false) c.drawImage(spr_gabe_chat, 0, -255/1.25, 260/1.25, 285/1.25);
  else if (this.collapsed == true) c.drawImage(spr_gabe_chat_collapsed, 0, 0, 166/1.25, 28/1.25);
  c.restore();
};

function handleBosses() {
  if (framecount % 1000 == 1 && !alert_boss_deployed && kills >= 35) {
    enemies.push(new Enemy(width/2, height/2, 419, 120, 'alert_boss'));
    alert_boss_deployed = true;
  } else { 
    alert_boss_deployed = false;
  }
}

function handlePowerups() {
  if (mouseDown) {
    if (!doritos_power&&!dew_power&&!sanic_power&&!diamond_power&&!weed_power) {
      bullets.push(new Bullet(player, 25, 15, "chicken", 20));
    }
    if (doritos_power && dew_power || sanic_power) {
      snooptrain.pause();
    } else {
      snooptrain.play();
    }
    if (doritos_power == true && doritos_power_timer > 1) {
      bullets.push(new Bullet(player, 20, 20, "doritos", 10));
      bullets.push(new Bullet(player, 10, 10, "doritos", 15));
    }
    if (dew_power == true && dew_power_timer > 1) {
      bullets.push(new Bullet(player, 30, 15, "mountdew", 17));
    }
    if (sanic_power == true && sanic_power_timer > 1) {
      player.speed = 40;
      bullets.push(new Bullet(player, 20, 20, "ring", 40));
    }
    if (diamond_power == true && diamond_power_timer > 1) {
      bullets.push(new Bullet(player, 25, 25, "diamond", 15));
    }
    if (weed_power == true && weed_power_timer > 1) {
      bullets.push(new Bullet(player, 25, 25, "weed", 8));
    }
  }
  doritos_timer--;
  if (doritos_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 50, 60, "doritos"));
    doritos_timer = 1600;
  }
  doritos_power_timer--;
  if (doritos_power_timer < 1) {
    doritos_power = false;
    combo.currentTime = 0;
    combo.pause();
  }
  mountdew_timer--;
  if (mountdew_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 50, 25, "mountdew"));
    mountdew_timer = 1600 * 3;
  }
  dew_power_timer--;
  if (dew_power_timer < 1) {
    dew_power = false;
    combo.pause();
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
  sanic_power_timer--;
  if (sanic_power_timer < 1) {
    gofast.pause();
    sanic_power = false;
    player.speed = 5;
  }
  diamond_timer--;
  if (diamond_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 40, 40, "diamond"));
    diamond_timer = 1600 * 5;
  }
  diamond_power_timer--;
  if (diamond_power_timer < 1) {
    diamond_power = false;
  }
  weed_timer--;
  if (weed_timer < 1) {
    drops.push(new Drop(random(100, width - 100), random(100, height - 100), 50, 50, "weed"));
    weed_timer = 1600 * 3;
  }
  weed_power_timer--;
  if (weed_power_timer < 1) {
    weed_power = false;
  }
  if (weed_power) {
    c.globalAlpha = 0.5;
  } else {
    c.globalAlpha = 1.0;
  }
  if (sanic_power) {
    if (combo.currentTime === 0) {
      gofast.play();
    }
  } else {
    gofast.pause();
    gofast.currentTime = 0;
  }
  if (doritos_power && dew_power || sanic_power) {
    worldX = random(-20, 20);
    worldY = random(-20, 20);
  } else {
    worldX = random(-shake_scale, shake_scale);
    worldY = random(-shake_scale, shake_scale);
  }
  if (worldX < 0) worldX += 5;
  if (worldX > 0) worldX -= 5;
  if (worldY < 0) worldY += 5;
  if (worldY > 0) worldY -= 5;
}

function give_doritos(time) {
  doritos_power = true;
  doritos_power_timer = time;
}
function give_dew(time) {
  dew_power = true;
  dew_power_timer = time;
}
function give_sanic(time) {
  sanic_power = true;
  sanic_power_timer = time;
}
function give_diamond(time) {
  diamond_power = true;
  diamond_power_timer = time;
}
function give_weed(time) {
  weed_power = true;
  weed_power_timer = time;
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
  this.health = 11;
  this.behaviour = 'player';
}
Player.prototype.control = function() {
  if (leftPressed && this.velx > -this.speed && this.x > this.width/1.25) this.velx--;
  if (rightPressed && this.velx < this.speed && this.x < width - this.width/1.25) this.velx++;
  if (upPressed && this.vely > -this.speed && this.y > this.height/1.25) this.vely--;
  if (downPressed && this.vely < this.speed && this.y < height - this.height/1.25) this.vely++;
};
Player.prototype.update = function() {
  this.x += this.velx;
  this.y += this.vely;
  this.velx *= dampening;
  this.vely *= dampening;
  this.dx = mouseX - (this.x);
  this.dy = mouseY - (this.y);
  this.angle = Math.atan2(this.dy, this.dx);
  this.control();
  this.hx = this.x - (this.width / 2);
  this.hy = this.y - (this.height / 2);
  pl_health_bar.update();
};
Player.prototype.display = function() {
  c.fillStyle = 'rgba(255, 0, 0, 0.5)';
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  if (showhitboxes) c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  c.drawImage(spr_player, -this.width / 2, -this.height / 2, this.width, this.height);
  pl_health_bar.display();
  c.restore();
};

function HealthBar(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.c_width = w;
  this.h_width = w;
  this.height = h;
}
HealthBar.prototype.update = function() {
  this.h_width = player.health * 5;
};
HealthBar.prototype.display = function() {
  c.save();
  c.translate(this.x, this.y);
  c.fillStyle = '#41C1E8';
  c.fillRect(-this.c_width/2, 0, this.c_width, this.height);
  c.fillStyle = '#E85D41';
  c.fillRect(-(this.c_width/2 )- 1, -1, this.h_width + 2, this.height + 2);
  c.restore();
};

function Turret(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
  this.health = 3400;
  this.dx = 0;
  this.dy = 0;
}
Turret.prototype.update = function() {
  bullets.push(new Bullet(this, 25, 15, "pringles", 20));
  if (kills >= 300) bullets.push(new Bullet(this, 7, 7, "doritos", 15));
  if (kills >= 400) this.height = 52;
  if (0 < enemies.length) {
    for (var cl_en, max = Number.MAX_VALUE, i = 0; i < enemies.length; i++) {
      var f_en = enemies[i];
      var dist = Math.pow(player.x - f_en.x, 2) + Math.pow(player.y - f_en.y, 2);
      dist < max && (cl_en = f_en, max = dist)
    }
    this.dx = cl_en.x - this.x;
    this.dy = cl_en.y - this.y;
    this.angle = Math.atan2(this.dy, this.dx)
  }
  this.health--;
  if (this.health < 1) this.alive = false;
};
Turret.prototype.display = function() {
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  if (kills < 400) c.drawImage(spr_turret, -this.width / 2, -this.height / 2, this.width, this.height);
  if (kills >= 400) c.drawImage(spr_turret_1, -this.width / 2, -this.height / 2, this.width, this.height);
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
    if (this.type == "diamond") give_diamond(700);
    if (this.type == "weed") {
      give_weed(700);
      weed.play();
    }
    if (this.type == "health") {
      player.health = 11;
      mario_up.play();
    }
    if (this.type == "sanic") {
      give_sanic(700);
      snooptrain.pause();
    }
    if (doritos_power && dew_power) {
      combo.play();
      wow.play();
      gofast.pause();
      snooptrain.pause();
    } else {
      combo.pause();
      combo.currentTime = 0;
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
  if (this.type == "diamond") c.drawImage(spr_diamond_block, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "weed") c.drawImage(spr_weed_leaf, -this.width / 2, -this.height / 2, this.width, this.height);
  c.restore();
};

function Particle(x, y, size, dither, type) {
  this.x = x;
  this.y = y;
  this.dither = dither;
  this.size = size;
  this.velx = Math.random() * (-dither - dither) + dither;
  this.vely = Math.random() * (-dither - dither) + dither;
  this.health = 15;
  this.type = type;
}
Particle.prototype.update = function () {
  this.x += this.velx;
  this.y += this.vely;
  this.velx *= 0.875;
  this.vely += 0.3;
  this.health--;
  if (this.health < 1) {
    this.alive = false;
  }
};
Particle.prototype.display = function () {
  c.fillStyle = "rgba(51, 151, 255, 1)";
  if (this.type == 'hitmarker') c.drawImage(spr_hitmarker, this.x, this.y, 36/2, 36/2);
  if (this.type == 'adblock') c.drawImage(spr_adblock, this.x, this.y, 18, 18);
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
    this.velx = (Math.cos(parent.angle) * s) + random(-2, 2);
    this.vely = (Math.sin(parent.angle) * s) + random(-2, 2);
  } else if (this.type == "pringles") {
    this.velx = (Math.cos(parent.angle) * s) + random(-1, 1);
    this.vely = (Math.sin(parent.angle) * s) + random(-1, 1);
  } else if (this.type == "mountdew") {
    this.velx = (Math.cos(parent.angle) * s) + random(-6, 6);
    this.vely = (Math.sin(parent.angle) * s) + random(-4, 4);
  } else if (this.type == "ring") {
    this.velx = (Math.cos(parent.angle) * s) + random(-6, 6);
    this.vely = (Math.sin(parent.angle) * s) + random(-4, 4);
  } else if (this.type == "diamond") {
    this.velx = (Math.cos(parent.angle) * s) + random(-4, 4);
    this.vely = (Math.sin(parent.angle) * s) + random(-4, 4);
  } else if (this.type == "weed") {
    this.velx = (Math.cos(parent.angle) * s) + random(-1.5, 1.5);
    this.vely = (Math.sin(parent.angle) * s) + random(-1.5, 1.5);
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
  if (this.type == "diamond") c.drawImage(spr_diamond, -this.width / 2, -this.height / 2, this.width, this.height);
  if (this.type == "weed") c.drawImage(spr_weed_bag, -this.width / 2, -this.height / 2, this.width, this.height);
  c.restore();
};

function Enemy(x, y, w, h, behaviour) {
  this.x = x;
  this.y = y;
  this.hx = this.x;
  this.hy = this.y;
  this.velx = 0;
  this.vely = 0;
  this.width = w;
  this.height = h;
  if (behaviour == 'alert_boss') {
    this.speed = 4;
    this.health = 350;
  } else if (behaviour == 'enemy') {
    this.speed = 2;
    this.health = 15;
  }
  this.angle = 0;
  this.alive = true;
  this.behaviour = behaviour;
}
Enemy.prototype.update = function() {
  this.x += this.velx;
  this.y += this.vely;
  this.velx *= dampening;
  this.vely *= dampening;
  this.velx += Math.cos(this.angle) / this.speed;
  this.vely += Math.sin(this.angle) / this.speed;
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
  if (this.behaviour != 'alert_boss') c.rotate(this.angle);
  if (showhitboxes) c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  if (this.behaviour == 'enemy') {
    if (spooky_mode) c.drawImage(spr_spooky_enemy, -this.width / 2, -this.height / 2, this.width, this.height);
    else c.drawImage(spr_enemy, -this.width / 2, -this.height / 2, this.width, this.height);
  }
  c.restore();
  c.save();
  c.scale(1, 1);
  c.translate(this.x, this.y);
  if (this.behaviour == 'alert_boss') {
    if (this.health >= 275) c.drawImage(spr_alert_boss_1, -this.width / 2, -this.height / 2, this.width, this.height);
    if (this.health >= 150 && this.health < 275) c.drawImage(spr_alert_boss_2, -this.width / 2, -this.height / 2, this.width, this.height);
    if (this.health < 150) c.drawImage(spr_alert_boss_3, -this.width / 2, -this.height / 2, this.width, this.height);
  }
  c.restore();
};

function arrayCollision(arrayA, arrayB) {
  for (var i = 1; i < arrayA.length; i++) {
    var this1 = arrayA[i];
    for (var j = 0; j < arrayB.length; j++) {
      var this2 = arrayB[j];
      if (this2.behaviour != 'alert_boss') {
        var disX = this2.x - this1.x;
        var disY = this2.y - this1.y;
        if (Math.sqrt((disX * disX) + (disY * disY)) < this1.width) {
          collisionBetween(this1, this2);
        }
      } else {
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
          if (shapeA.type == "diamond") shapeB.health -= 2;
          if (shapeA.type == "weed") shapeB.health -= 2;
          if (shapeB.behaviour == 'enemy' && boolean_particles % 2 == 0) particles.push(new Particle(shapeA.x, shapeB.y, 5, 5, 'hitmarker'));
          if (shapeB.behaviour == 'alert_boss' && boolean_particles % 2 == 0) particles.push(new Particle(shapeA.x, shapeB.y, 5, 5, 'adblock'));
          if (!diamond_power) {
            hit.play();
            hit.currentTime = 0;
          } else {
            smash.play();
            smash.currentTime = 0;
          }
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
          if (shapeA.type == "diamond") shapeB.health -= 2;
          if (shapeA.type == "weed") shapeB.health -= 2;
          if (shapeB.behaviour == 'enemy' && boolean_particles % 2 == 0) particles.push(new Particle(shapeA.x, shapeB.y, 5, 5, 'hitmarker'));
          if (shapeB.behaviour == 'alert_boss' && boolean_particles % 2 == 0) particles.push(new Particle(shapeA.x, shapeB.y, 5, 5, 'adblock'));
          if (!diamond_power) {
            hit.play();
            hit.currentTime = 0;
          } else {
            smash.play();
            smash.currentTime = 0;
          }
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
          if (shapeA.type == "diamond") shapeB.health -= 2;
          if (shapeA.type == "weed") shapeB.health -= 2;
          if (shapeB.behaviour == 'enemy' && boolean_particles % 2 == 0) particles.push(new Particle(shapeA.x, shapeB.y, 5, 5, 'hitmarker'));
          if (shapeB.behaviour == 'alert_boss' && boolean_particles % 2 == 0) particles.push(new Particle(shapeA.x, shapeB.y, 5, 5, 'adblock'));
          if (!diamond_power) {
            hit.play();
            hit.currentTime = 0;
          } else {
            smash.play();
            smash.currentTime = 0;
          }
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
          if (shapeA.type == "diamond") shapeB.health -= 2;
          if (shapeA.type == "weed") shapeB.health -= 2;
          if (shapeB.behaviour == 'enemy' && boolean_particles % 2 == 0) particles.push(new Particle(shapeA.x, shapeB.y, 5, 5, 'hitmarker'));
          if (shapeB.behaviour == 'alert_boss' && boolean_particles % 2 == 0) particles.push(new Particle(shapeA.x, shapeB.y, 5, 5, 'adblock'));
          if (!diamond_power) {
            hit.play();
            hit.currentTime = 0;
          } else {
            smash.play();
            smash.currentTime = 0;
          }
        }
      }
    }
  }
  return colDir;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
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
  
  if (!low_res_mode) {
    if (window.innerWidth >= 2560) {
      canvas.width = 2560;
      canvas.height = 1440;
      scale = 2;
      c.font = '13pt Comic Sans MS';
    } else if (window.innerWidth >= 1920) {
      canvas.width = 1920;
      canvas.height = 1080;
      scale = 1.5;
      c.font = '13pt Comic Sans MS';
    } else if (window.innerWidth >= 1366 && window.innerHeight >= 768  && window.innerWidth < 1920 && fps > 30) {
      canvas.width = 1366;
      canvas.height = 768;
      scale = 1.0671875;
      c.font = '13pt Comic Sans MS';
    } else if (window.innerWidth >= 1280 && window.innerHeight >= 720 && window.innerWidth < 1366 && fps > 30) {
      canvas.width = 1280;
      canvas.height = 720;
      scale = 1;
      c.font = '13pt Comic Sans MS';
    }
  } else if (fps <= 35) {
    canvas.width = 640;
    canvas.height = 360;
    scale = 0.5;
    c.font = '15pt Comic Sans MS';
  }
};
window.addEventListener('resize', resize, false);
loaded = true;
