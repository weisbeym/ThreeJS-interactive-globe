"use strict";

const THREE = require("three");
const container = document.getElementById("three");
const width = window.innerWidth;
const height = window.innerHeight;
const viewAngle = 45;
const aspectRatio = width/height;
const nearClippingPlane = 0.1;
const farClippingPlane = 10000;

//----Renderer----//
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

//----Camera----//
const camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, nearClippingPlane, farClippingPlane);
camera.position.set(0, 0, 500); // x = 0, y = 0, z = 500

//----Scene----//
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000);
scene.add(camera);

// add renderer to div
container.appendChild(renderer.domElement);

// creating sphere for globe 
const radius = 200;
const segments = 50;
const rings = 50;

const globe = new THREE.Group(); // group to hold all the globe mesh and sphere 
scene.add(globe);

// load texture and make sphere
const loader = new THREE.TextureLoader();
loader.load("images/land_ocean_ice_cloud_2048.jpg", (texture) => {
    //make the sphere
    const sphere = new THREE.SphereGeometry(radius, segments, rings);

    //map texture to sphere
    const material = new THREE.MeshBasicMaterial( {map: texture, overdraw: 0.5} );

    //create mesh using geometry(sphere) and material 
    const mesh = new THREE.Mesh(sphere, material);

    //add mesh to globe
    globe.add(mesh);
});

//position globe backwards
globe.position.z = -300;

//----Lights----//
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 400;
scene.add(pointLight);

//get the first frame going
requestAnimationFrame(update);

//get rotation
document.onkeydown = checkKey;

function update() {
    //render
    renderer.render(scene, camera);
    //update loop
    requestAnimationFrame(update);
}

function animationBuilder(direction) {
    return function animateRotate() {
        switch(direction) {
            case "up":
                globe.rotation.x -= 0.2;
                break;

            case "down":
                globe.rotation.x += 0.2;
                break;

            case "left":
                globe.rotation.y -= 0.2;
                break;

            case "right":
                globe.rotation.y += 0.2;
                break;

            default:
                break;
        }
    }
}

const animateDirection = {
    up: animationBuilder("up"),
    down: animationBuilder("down"),
    left: animationBuilder("left"),
    right: animationBuilder("right")
}

function checkKey(e) {
    e = e || window.event;
    e.preventDefault();

    //use keycode to recognise keys
    if(e.keyCode == "38") {
        animateDirection.up();
    } else if(e.keyCode == "40") {
        animateDirection.down();
    } else if(e.keyCode == "37") {
        animateDirection.left();
    } else if(e.keyCode == "39") {
        animateDirection.right();
    }
}