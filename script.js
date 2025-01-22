// import { WarpUp, WarpRight, WarpDown, WarpLeft, WarpCave, WarpUpPos, WarpRightPos, WarpDownPos, WarpLeftPos } from "./warps.js";

var WarpUp = "g8";
var WarpRight = "h9";
var WarpDown = "i8";
var WarpLeft = "h7";
var WarpCave = "swordcave";

var WarpUpPos = { // WU
    x: 8, // Starting X Pos
    y: 10  // Starting Y Pos
};
var WarpRightPos = { // WR
x: 0, // Starting X Pos
y: 0  // Starting Y Pos
};
var WarpDownPos = { //WD
x: 0, // Starting X Pos
y: 0  // Starting Y Pos
};
var WarpLeftPos = { //WL
x: 0, // Starting X Pos
y: 0  // Starting Y Pos
};
var WarpCavePos = { //WC
x: 8, // Starting X Pos
y: 10  // Starting Y Pos
};

// Game setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Scaling
const TILE_SIZE = 32;
const PLAYER_SCALE = 1;

let map = {};
let currentMap = "spawn_map"; // Set the map to start on
let maps = {};

// Starting Position
let player = {
    x: 8, // Starting X Pos
    y: 6  // Starting Y Pos
};

// Load images
const images = {
    player: new Image(),
    wall: new Image(),
    ground: new Image(),
    cave: new Image(),
    oldMan: new Image()
};

images.player.src = "images/player.bmp";
images.wall.src = "images/tile.png";
images.ground.src = "images/ground.png";
images.cave.src = "images/cave.png";
images.oldMan.src = "images/oldman.png";

let groundTile = images.ground;

// Debug image loading
const loadedImages = [];
Object.keys(images).forEach((key) => {
    images[key].onload = () => {
        loadedImages.push(key);
        console.log(`${key} image loaded.`);
        if (loadedImages.length === Object.keys(images).length) {
            console.log("All images loaded!");
            startUp(currentMap);// Load and draw map after getting all the images
        }
    };
    images[key].onerror = () => console.error(`Error loading image: ${key}`);
});

// Load map from PHP
async function loadMap(mapName) {
    await fetch("map.php?map=" + mapName)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch map data.");
            return response.json();
        })
        .then(data => {
            console.log("Map data loaded:", data); // Check the map data
            maps[mapName] = data;
            map = data; // Set current map
            // if (callback) callback(); // Call the callback after the map is loaded
            // drawGame();
        })
        .catch(err => console.error("Error loading map:", err));
}

// Switch Map
async function switchMap(newMap) {
    console.log(`Switching to ${newMap}`);
    if (!maps[newMap]) {
        // Load the map if not already loaded
        await loadMap(newMap);
    } else {
        map = maps[newMap];
    }
    currentMap = newMap;



    if (newMap === "swordcave") {
        groundTile = images.cave;
        WarpDown = "spawn_map";
        WarpDownPos = { x: 5, y: 1 };
        console.log(WarpDownPos);

    } else if (newMap === "spawn_map") {
        WarpUp = "g8";
        WarpUpPos = { x: 8, y: 10 };
        WarpCave = "swordcave";
        WarpCavePos = { x: 8, y: 10 };

    } else if (newMap === "g8") {
        WarpDown = "spawn_map";
        WarpDownPos = { x: player.x, y: player.y - 10 };

    } else {
        // Default player position
        player.x = 8;
        player.y = 6;
    }
    drawGame();
}


// Draw the game
function drawGame() {
    if (!map || !Array.isArray(map)) {
        console.warn("Map is empty or invalid. Cannot draw the game.");
        return;
    }

    console.log("Drawing game...");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentMap === "swordcave") {
        groundTile = images.cave;
    } else {
        groundTile = images.ground;
    }
    // Draw the map
    map.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (tile === 0 || tile === '0') {
                // Walkable tile, apply map-specific logic
                if (currentMap === "swordcave") {
                    ctx.drawImage(
                        groundTile,
                        colIndex * TILE_SIZE,
                        rowIndex * TILE_SIZE,
                        TILE_SIZE,
                        TILE_SIZE
                    );
                } else {
                    ctx.drawImage(
                        groundTile,
                        colIndex * TILE_SIZE,
                        rowIndex * TILE_SIZE,
                        TILE_SIZE,
                        TILE_SIZE
                    );
                }
            } else if (tile === 1) {
                // Draw obstacle tile
                ctx.drawImage(
                    images.wall,
                    colIndex * TILE_SIZE,
                    rowIndex * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                );
            } else if (tile === 'B') {
                // Draw cave entrance
                ctx.drawImage(
                    images.cave,
                    colIndex * TILE_SIZE,
                    rowIndex * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                );
            } else if (tile === 'WU' || tile === 'WR' || tile === 'WD' || tile === 'WL') {
                // Draw warp tile
                ctx.drawImage(
                    groundTile,
                    colIndex * TILE_SIZE,
                    rowIndex * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                ); 
            } else if (tile === 'WC') {
                // Draw warp cave tile
                ctx.drawImage(
                    images.cave,
                    colIndex * TILE_SIZE,
                    rowIndex * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                );
            } else if (tile === 'O') {
                // Draw Old Man tile
                ctx.drawImage(
                    images.oldMan,
                    colIndex * TILE_SIZE,
                    rowIndex * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                );
            } else {
                // Default fallback for unexpected tiles
                ctx.fillStyle = "pink"; // Debug color for unhandled tiles
                ctx.fillRect(
                    colIndex * TILE_SIZE,
                    rowIndex * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                );
            }
        });
    });


    // Draw the player
    ctx.drawImage(
        images.player,
        player.x * TILE_SIZE + (TILE_SIZE - TILE_SIZE * PLAYER_SCALE) / 2,
        player.y * TILE_SIZE + (TILE_SIZE - TILE_SIZE * PLAYER_SCALE) / 2,
        TILE_SIZE * PLAYER_SCALE,
        TILE_SIZE * PLAYER_SCALE
    );

    console.log("Game drawn successfully.");
}

// Handle keyboard input
window.addEventListener("keydown", (event) => {
    const { x, y } = player;
    console.log(player);

    // Define movement conditions
    if (event.key === "ArrowUp" && map[y - 1]?.[x] === 0) player.y--;
    if (event.key === "ArrowUp" && map[y - 1]?.[x] === 'WC') {
        player.y--;
        player = WarpCavePos;
        switchMap(WarpCave);
        return;
    }
    if (event.key === "ArrowUp" && map[y - 1]?.[x] === 'WU') {
        player.y--;
        player = WarpUpPos;
        switchMap(WarpUp);
        return;
    }
    if (event.key === "ArrowDown" && map[y + 1]?.[x] === 0) player.y++;
    if (event.key === "ArrowDown" && map[y + 1]?.[x] === 'WD') {
        player.y++;
        player = WarpDownPos;

        switchMap(WarpDown);
        console.log("test");
        console.log(player);
        return;
    }
    if (event.key === "ArrowLeft" && map[y]?.[x - 1] === 0) player.x--;
    if (event.key === "ArrowRight" && map[y]?.[x + 1] === 0) player.x++;

    drawGame();
});

async function startUp(currentMap) {
    await loadMap(currentMap);
    drawGame();
}
