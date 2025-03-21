// Replace the entire script.js with this corrected version

let scene, camera, renderer, controls;
let world = new Map();
let selectedBlock = 1;
const BLOCK_SIZE = 1;

class Block {
    static textures = {
        1: 'grass',
        2: 'dirt',
        3: 'stone'
    };

    constructor(type, x, y, z) {
        this.type = type;
        this.mesh = this.createMesh(x, y, z);
    }

    createMesh(x, y, z) {
        const geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        const color = this.getColor();
        const material = new THREE.MeshBasicMaterial({ color: color });
        return new THREE.Mesh(geometry, material);
    }

    getColor() {
        const colors = { 
            grass: 0x00ff00, 
            dirt: 0x8B4513, 
            stone: 0x808080 
        };
        return colors[Block.textures[this.type]];
    }
}

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue background
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Camera position - start above ground
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    // Add lights (crucial for visibility)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 20, 0);
    scene.add(directionalLight);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Generate world
    generateTerrain(16, 16);

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', handleKeys);
    document.addEventListener('mousedown', handleMouseClick);

    animate();
}

function generateTerrain(width, depth) {
    for (let x = -width; x < width; x++) {
        for (let z = -depth; z < depth; z++) {
            const height = Math.floor(Math.random() * 3) + 1;
            for (let y = 0; y < height; y++) {
                const type = y === height - 1 ? 1 : 2;
                addBlock(type, x, y, z);
            }
        }
    }
}

function addBlock(type, x, y, z) {
    const key = `${x},${y},${z}`;
    if (!world.has(key)) {
        const block = new Block(type, x, y, z);
        block.mesh.position.set(x, y, z);
        scene.add(block.mesh);
        world.set(key, block);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Rest of the functions remain the same as previous version
// Keep the existing handleKeys, handleMouseClick, animate functions
// (from the original answer but remove the createHotbar reference)

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Required for damping
    renderer.render(scene, camera);
}

// Initialize the game
init();