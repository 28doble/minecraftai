let scene, camera, renderer, controls;
let world = new Map(); // Stores block positions
let selectedBlock = 1; // 0: air, 1: grass, 2: dirt, 3: stone
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
        const materials = Array(6).fill(new THREE.MeshBasicMaterial({ color: this.getColor() }));
        return new THREE.Mesh(geometry, materials);
    }

    getColor() {
        const colors = { grass: 0x00ff00, dirt: 0x8B4513, stone: 0x808080 };
        return colors[Block.textures[this.type]];
    }
}

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Player position
    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);

    // Controls
    document.addEventListener('keydown', handleKeys);
    document.addEventListener('mousedown', handleMouseClick);

    // Generate world
    generateTerrain(16, 16);
    createHotbar();
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

function removeBlock(x, y, z) {
    const key = `${x},${y},${z}`;
    if (world.has(key)) {
        scene.remove(world.get(key).mesh);
        world.delete(key);
    }
}

// Input handling and animation loop (simplified)
function handleKeys(e) {
    const speed = 0.2;
    if (e.key === 'w') camera.position.z -= speed;
    if (e.key === 's') camera.position.z += speed;
    if (e.key === 'a') camera.position.x -= speed;
    if (e.key === 'd') camera.position.x += speed;
}

function handleMouseClick(e) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    
    if (intersects.length > 0) {
        const pos = intersects[0].object.position;
        if (e.button === 0) removeBlock(pos.x, pos.y, pos.z);
        if (e.button === 2) addBlock(selectedBlock, pos.x + intersects[0].face.normal.x, 
                                    pos.y + intersects[0].face.normal.y, 
                                    pos.z + intersects[0].face.normal.z);
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Initialize game
init();