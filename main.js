//Select the container and set the number of particles.
const particlesCount = 40000;
const container = document.getElementById('demo');

//Initialise the renderer, make the background transparent and append it to the container.
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

//Create the camera and set its position.
const camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);

//Starting position of the camera.
camera.position.z = 900;

//Create the scene, remove the default background and add a fog effect.
const scene = new THREE.Scene();
scene.background = null;
scene.fog = new THREE.Fog(0x050505, 2500, 3500);

//Create a buffer geometry and set the attributes.
const geometry = new THREE.BufferGeometry();
const positions = [], colors = [];
const color = new THREE.Color();
const n = 1000, n2 = n / 2;

//Add the particles to the array.
for (let i = 0; i < particlesCount; i++)
{
    //Pick a random position.
    const x = Math.random() * n - n2, y = Math.random() * n - n2, z = Math.random() * n - n2;

    //Add the position to the array.
    positions.push(x, y, z);

    //Pick a random color for the particle and add it to the array.
    const vx = (x / n) + 0.5, vy = (y / n) + 0.5, vz = (z / n) + 0.5;
    color.setRGB(vx, vy, vz);
    colors.push(color.r, color.g, color.b);
}

const gl = renderer.getContext(), pos = gl.createBuffer(), pos2 = gl.createBuffer(), rgb = gl.createBuffer();

//Get the position array and colour array and bind it to the buffer geometry.
gl.bindBuffer(gl.ARRAY_BUFFER, pos), gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, rgb), gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

//Create a buffer attribute and set the position and colour attributes of the buffer geometry.
const posAttr = new THREE.GLBufferAttribute(pos, gl.FLOAT, 3, 4, particlesCount);
geometry.setAttribute('position', posAttr);
geometry.setAttribute('color', new THREE.GLBufferAttribute(rgb, gl.FLOAT, 3, 4, particlesCount));

//Create a material for the particles.
const material = new THREE.PointsMaterial({
    size: 10,
    vertexColors: true
});

const points = new THREE.Points(geometry, material);
points.frustumCulled = false;

//Add the particles to the scene.
scene.add(points);

const animate = () => {
    requestAnimationFrame(animate);
    render();
}

//Move the camera and re-render the scene. The position of the camera is controlled by the current system time.
const render = () => {
    const time = Date.now() * 0.001;

    points.rotation.x = time * 0.005;
    points.rotation.y = time * 0.007;

    renderer.render(scene, camera);
}

//Change the size of the render when the window is resized.
const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

//When the user scrolls, change the camera position and rotate the particles.
document.body.onscroll = () => { 
    points.position.z = window.pageYOffset / 20;
    camera.rotation.z = window.pageYOffset / 30000;
}

//Add the event listener for the window resize event.
window.addEventListener('resize', onWindowResize);

//Start the animation.
animate();