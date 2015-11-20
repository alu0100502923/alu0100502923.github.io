var camera, scene, renderer, controls, movement = 10, height = 2.2, angle = -0.000866, n_angle = 0, multiplier = 1;
var camera_option = prompt ("Camera Selection (1 - 3): ", 1);
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.maxAlternatives = 10;

recognition.onresult = function(event) {
var line = '';
	for (var i = event.resultIndex; i < event.results.length; ++i) {
		if (event.results[i].isFinal) {
			text = event.results[i][0].transcript;
			line += event.results[i][0].transcript;
			select.options[i] = new Option(text, text);
			if ((text.indexOf("derecha") != -1) || (text.indexOf("right") != -1)){
				movement = 10;
				angle = -0.000866;
			} else if ((text.indexOf("izquierda") != -1) || (text.indexOf("left") != -1)) {
				movement = -10;
				angle = 0.000866;
			} else if ((text.indexOf("rápido") != -1) || (text.indexOf("fast") != -1)) {
				multiplier *= 5;
			} else if ((text.indexOf("lento") != -1) || (text.indexOf("slow") != -1)) {
				multiplier /= 5;
			}
		}
	}
}

function start() {
	select.options.length = 0;
	recognition.start();
}

document.addEventListener( "DOMContentLoaded", function( e ) {
  init();
  animate();
});

//Animate function
function animate() {
  requestAnimationFrame(animate);
  render();
}

//Render scene function
function render() {
  var flag = false;
  /*
  rot = 0.02;
  
  player.rotation.y += rot;
  player2.rotation.y -= rot;
  */

  if (player.position.x <= -2500) {
	movement = 10;
	angle = -0.000866;
  } else if (player.position.x >= 2500) {
    movement = -10;
	angle = 0.000866;
  }
  player.position.x += (movement * multiplier);
  n_angle += (angle * multiplier);
  player.position.y = Math.tan(n_angle) * player.position.x;
  if (player.position.x < 0) {
	if (movement > 0) {
		height = 2.2;
	} else if (movement < 0) {
		height = -2.2;
	}
  } else if (player.position.x > 0) {
    if (movement > 0) {
		height = -2.2;
	} else if (movement < 0) {
		height = 2.2;
	}
  }
  player.rotation.z += angle * multiplier;
  seesaw.rotation.z += angle * multiplier;
  
  renderer.render(scene, camera);
}

//Start script function
function init() {

  start();
    
  scene = new THREE.Scene();	//Scene creation

  camera = new THREE.PerspectiveCamera(77, window.innerWidth / window.innerHeight, 0.1, 10000);	//Camera creation
  
  //Camera options for different perspectives (tried a switch, but seems that doesn't work with a prompt-read variable)
  if (camera_option == 1) {
//    camera.position.z = 1500;
	camera.position.z = 3000;
  }
  else if (camera_option == 2) {
    camera.position.set(0, 1500, 600);
	camera.rotation.x = 200;
  }
  else if (camera_option == 3) {
    camera.position.set(1700, 700, 800);
	camera.rotation.set(100, -200, -50);
  }
  else {
    camera.position.set(1000, 1500, 0);
	camera.rotation.y = 300;
  }
  scene.add(camera);

  //Player objects creation. Player 2 will translate and rotate in order to stand in front of player.
  player = buildPlayer();
  /*
  player.translateX(-700);
  player2 = player.clone();
  player2.scale.set(0.8, 0.8, 0.7);
  player2.translateX(1200);
  player2.rotateY(Math.PI);
  */
//  player.translateX(-2500);
//  player.translateY(-550);
  scene.add(player);
//  scene.add(player2);
  
  /*
  rocker = buildRocker();
  rocker.position.y = 0;
  scene.add(rocker);
  */
  rocker = buildRocker2();
  rocker.position.y = 0;
  scene.add(rocker);
  
  seesaw = buildSeesaw();
  seesaw.position.y = 0;
  scene.add(seesaw);
  
  //Added ambient and directional light, so we can appreciate different shines.
  scene.add( new THREE.AmbientLight(0x111100) );
  var light = new THREE.DirectionalLight(); // default white light
  light.position.set( 0, 0, 3 );
  scene.add(light);

  //Renderer initialization
//  renderer = new THREE.CanvasRenderer();
  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xFFF68F);

  document.body.appendChild(renderer.domElement);
}

//Build player, block-made people mostly, with translations and rotations in the body components to change the figure standing.
function buildPlayer() {

  var player = new THREE.Object3D(); //Player is the Object3D base, where the components will group (head, arm, body...)

  var material = new THREE.MeshNormalMaterial();
  var material_red = new THREE.MeshBasicMaterial({color: 0xDF0101});
//  var material_blue = new THREE.MeshBasicMaterial({color: 0x045FB4});
//  var material_brown = new THREE.MeshBasicMaterial({color: 0x61380B});
  var mp_blue = new THREE.MeshPhongMaterial( {
       color: 0x045FB4,
       ambient: 0x045FB4,
       specular: 0x003344,
       shininess: 100,
       shading: THREE.FlatShading,
       side: THREE.DoubleSide
  } );
  var mp_brown = new THREE.MeshPhongMaterial( {
       color: 0x61380B,
       ambient: 0x61380B,
       specular: 0x003344,
       shininess: 50,
       shading: THREE.FlatShading,
       side: THREE.DoubleSide
  } );
  
  var bodyg = new THREE.BoxGeometry(400, 500, 350);
  var body = new THREE.Mesh(bodyg, mp_blue);
  body.position.z = -150;
  player.add(body);

  var headg = new THREE.SphereGeometry(200);
  var head = new THREE.Mesh(headg, material);
  head.position.y = 400;
  head.position.z = -150;
  player.add(head);
  
  var legg = new THREE.BoxGeometry(150, 600, 150);
  var leg = new THREE.Mesh(legg, mp_blue);
  leg.rotation.z = 270;
  leg.position.x = -150;
  leg.position.z = -150;
  leg.position.y = -500;
  player.add(leg);
  var leg2 = leg.clone();
  leg2.translateX(200);
  player.add(leg2);
  
  var shoeg = new THREE.BoxGeometry(170, 75, 125);
  var shoe = new THREE.Mesh(shoeg, mp_brown);
  shoe.rotation.z = 270;
  shoe.position.x = -200;
  shoe.position.z = -150;
  shoe.position.y = -825;
  player.add(shoe);
  var shoe2 = shoe.clone();
  shoe2.translateX(200);
  player.add(shoe2);
  
  var armg = new THREE.BoxGeometry(500, 100, 100);
  var arm = new THREE.Mesh(armg, mp_blue);
  arm.position.x = -350;
  arm.position.y = 250;
  arm.position.z = -150;
  arm.rotation.z = 100;
  player.add(arm);
  var arm2 = arm.clone();
  arm2.translateX(800);
  arm2.rotation.z = 0;
  arm2.position.y = 150;
  player.add(arm2);
  
  var handg = new THREE.SphereGeometry(50);
  var hand = new THREE.Mesh(handg, material);
  hand.position.x = -580;
  hand.position.y = 390;
  hand.position.z = -150;
  player.add(hand);
  var hand2 = hand.clone();
  hand2.translateX(1200);
  hand2.position.y = 150;
  player.add(hand2);
  
  return player;
}

/*
function buildRocker() {
  var rocker = new THREE.Object3D(); //Rocker is the Object3D base, where the components will group (base and seesaw)

  var mp_green = new THREE.MeshPhongMaterial( {
       color: 0x008000,
       ambient: 0x045FB4,
       specular: 0x003344,
       shininess: 100,
       shading: THREE.FlatShading,
       side: THREE.DoubleSide
  } );
  
  var baseg = new THREE.CylinderGeometry(0, 300, 500, 4, 4, false);
  var base = new THREE.Mesh(baseg, mp_green);
  base.position.z = -150;
  base.position.y = -1200;
  rocker.add(base);
  
  var seesawg = new THREE.BoxGeometry(5000, 50, 200);
  var seesaw = new THREE.Mesh(seesawg, mp_green);
  seesaw.position.z = -150;
  seesaw.position.y = -900;
  rocker.add(seesaw);
  
  return rocker;
}
*/

function buildRocker2() {
  var rocker = new THREE.Object3D(); //Rocker is the Object3D base, where the components will group (base and seesaw)

  var mp_green = new THREE.MeshPhongMaterial( {
       color: 0x008000,
       ambient: 0x045FB4,
       specular: 0x003344,
       shininess: 100,
       shading: THREE.FlatShading,
       side: THREE.DoubleSide
  } );
  
  var baseg = new THREE.CylinderGeometry(0, 300, 500, 4, 4, false);
  var base = new THREE.Mesh(baseg, mp_green);
  base.position.z = -150;
  base.position.y = -1200;
  rocker.add(base);
  
  return rocker;
}

function buildSeesaw() {
  var seesaw = new THREE.Object3D(); //Rocker is the Object3D base, where the components will group (base and seesaw)

  var mp_green = new THREE.MeshPhongMaterial( {
       color: 0x008000,
       ambient: 0x045FB4,
       specular: 0x003344,
       shininess: 100,
       shading: THREE.FlatShading,
       side: THREE.DoubleSide
  } );

  var sawg = new THREE.BoxGeometry(5000, 50, 200);
  var saw = new THREE.Mesh(sawg, mp_green);
  saw.position.z = -150;
  saw.position.y = -900;
  seesaw.add(saw);
  
  return seesaw;
}
