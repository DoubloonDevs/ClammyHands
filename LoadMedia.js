var background = new Image();
background.src = 'img/background.png';
var spooky_background = new Image();
spooky_background.src = 'img/spooky_background.png';
var store_background = new Image();
store_background.src = 'img/spooky_background.png';

var spr_player = new Image();
// *GARY* spr_player.src = 'http://s27.postimg.org/gc3jp82yb/gary.png';
spr_player.src = 'img/spr_player.png';
var spr_spooky_enemy = new Image();
spr_spooky_enemy.src = 'img/spr_spooky_enemy.png';

var spr_weed_bag = new Image();
spr_weed_bag.src = 'img/spr_weed_bag.png';
var spr_weed_leaf = new Image();
spr_weed_leaf.src = 'img/spr_weed_leaf.png';
var spr_doritos_bag = new Image();
spr_doritos_bag.src = 'img/spr_doritos_bag.png';
var spr_chicken = new Image();
spr_chicken.src = 'img/spr_chicken.png';
var spr_cursor = new Image();
spr_cursor.src = 'img/spr_cursor.png';
var spr_enemy = new Image();
spr_enemy.src = 'img/spr_enemy.png';
var spr_hitmarker = new Image();
spr_hitmarker.src = 'img/spr_hitmarker.png';
var spr_doritos = new Image();
spr_doritos.src = 'img/spr_doritos.png';
var spr_pringle = new Image();
spr_pringle.src = 'img/spr_pringle.png';
var spr_mountdew = new Image();
spr_mountdew.src = 'img/spr_mountdew.png';
var spr_dew_can = new Image();
spr_dew_can.src = 'img/spr_dew_can.png';
var spr_health = new Image();
spr_health.src = 'img/spr_health.png';
var spr_sanic = new Image(); 
spr_sanic.src = 'img/spr_sanic.png';
var spr_ring = new Image();
spr_ring.src = 'img/spr_ring.png';
var spr_alert_boss_1 = new Image();
spr_alert_boss_1.src = 'img/spr_alert_boss_1.png';
var spr_alert_boss_2 = new Image();
spr_alert_boss_2.src = 'img/spr_alert_boss_2.png';
var spr_alert_boss_3 = new Image();
spr_alert_boss_3.src = 'img/spr_alert_boss_3.png';
var spr_diamond = new Image();
spr_diamond.src = 'img/spr_diamond.png';
var spr_diamond_block = new Image();
spr_diamond_block.src = 'img/spr_diamond_block.png';
var spr_adblock = new Image();
spr_adblock.src = 'img/spr_adblock.png';

var spr_turret = new Image();
spr_turret.src = 'img/spr_turret.png';
var spr_turret_1 = new Image();
spr_turret_1.src = 'img/spr_turret_1.png';

var spr_gabe_chat = new Image();
spr_gabe_chat.src = 'img/spr_gabe_chat.png';
var spr_gabe_chat_collapsed = new Image();
spr_gabe_chat_collapsed.src = 'img/spr_gabe_chat_collapsed.png';
var spr_gabe_chat_turret = new Image();
spr_gabe_chat_turret.src = 'img/spr_gabe_chat_turret.png';

var snooptrain = new Audio('sound/drop_it_like_a_train.wav');
snooptrain.volume = 0.35;
snooptrain.load();
var gofast = new Audio("sound/gotta_go_fast.wav");
gofast.volume = 0.35;
gofast.load();
var hit = new Audio("sound/hitmarker.wav");
hit.volume = 0.25;
hit.load();
var smash = new Audio("sound/glass_smash.wav");
smash.volume = 0.25;
smash.load();
var mario_up = new Audio("sound/smb_powerup.wav");
mario_up.volume = 0.3;
mario_up.load();
var combo = new Audio("sound/combo.wav");
combo.volume = 0.2;
combo.load();
var sad_violin = new Audio("sound/game_over.wav");
sad_violin.volume = 0.15;
sad_violin.load();
var wow = new Audio("sound/wow.wav");
wow.volume = 0.15;
wow.load();
var chat = new Audio("sound/alert.wav");
chat.volume = 0.3;
chat.load();
var weed = new Audio("sound/snoop.wav");
weed.volume = 0.35;
weed.load();