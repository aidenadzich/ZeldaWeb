class Warp {
    constructor(destination, destinationPos) {
        this.destination = destination; // Destination map name
        this.destinationPos = destinationPos; // Position on the destination map
    }

    activate(game) {
        game.switchMap(this.destination, this.destinationPos);
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(dx, dy, game) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        const tile = game.map[newY]?.[newX];
    
        if (tile instanceof Tile) {
            if (tile.isWalkable) {
                this.x = newX;
                this.y = newY;
            }
    
            if (tile instanceof WarpTile) {
                tile.activate(game);
            }
        }
    }
    
}

class Tile {
    constructor(isWalkable = true) {
        this.isWalkable = isWalkable;
    }
}

class GroundTile extends Tile {
    constructor(texture = "ground") {
        super(true); // Ground tiles are walkable
        this.texture = texture; // Default to "ground"
    }
}
class WallTile extends Tile {
    constructor(texture = "wall") {
        super(false); // Walls are not walkable
        this.texture = texture; // Default to "wall"
    }
}
class WarpTile extends Tile {
    constructor(destination, destinationPos, texture = null) {
        super(true); // Warps are walkable
        this.destination = destination;
        this.destinationPos = destinationPos;
        this.texture = texture;
    }

    activate(game) {
        game.switchMap(this.destination, this.destinationPos);
    }
}


class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.TILE_SIZE = 16;
        this.PLAYER_SCALE = 1;

        this.player = new Player(8, 6); // Starting position
        this.map = [];
        this.currentMap = "spawn_map";
        this.tileset = {
            ground: new GroundTile(),
            wall: new WallTile(),
            warp: null, // Warps are added dynamically
        };
        this.images = {};
        this.loadImages();
        this.loadMap(this.currentMap).catch(error => {
            console.error("Failed to fetch map data:", error);
        });
    }

    loadImages() {
        const imageSources = {
            player: "images/player.bmp",
            wall: "images/tile.png",
            ground: "images/ground.png",
            cave: "images/cave.png",
            oldMan: "images/oldman.png",
        };
        const loadedImages = [];

        Object.keys(imageSources).forEach((key) => {
            this.images[key] = new Image();
            this.images[key].src = imageSources[key];
            this.images[key].onload = () => {
                loadedImages.push(key);
                if (loadedImages.length === Object.keys(imageSources).length) {
                    this.start();
                }
            };
            this.images[key].onerror = () => console.error(`Error loading image: ${key}`);
        });
    }

    async loadMap(mapName) {
        if (!maps[mapName]) {
            console.error(`Map "${mapName}" not found.`);
            return;
        }
        this.map = maps[mapName];
    }
    
    
    

    switchMap(newMap, playerPosition) {
        this.loadMap(newMap);
        this.currentMap = newMap;
    
        if (playerPosition) {
            this.player.x = playerPosition.x;
            this.player.y = playerPosition.y;
        }
    
        this.draw();
    }
    

    draw() {
        const { ctx, TILE_SIZE, player, images, map } = this;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        map.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                const x = colIndex * TILE_SIZE;
                const y = rowIndex * TILE_SIZE;
    
                if (tile instanceof GroundTile || tile instanceof WallTile || tile instanceof WarpTile) {
                    const texture = images[tile.texture] || images.ground; // Default to ground if texture is missing
                    ctx.drawImage(texture, x, y, TILE_SIZE, TILE_SIZE);
                }
            });
        });
    
        ctx.drawImage(
            images.player,
            player.x * TILE_SIZE,
            player.y * TILE_SIZE,
            TILE_SIZE * this.PLAYER_SCALE,
            TILE_SIZE * this.PLAYER_SCALE
        );
    }
    
    

    async start() {
        await this.loadMap(this.currentMap); // Ensures the map is loaded
        this.draw();
        window.addEventListener("keydown", (e) => this.handleKeydown(e));
    }
    

    handleKeydown(event) {
        if (event.key === "ArrowUp") this.player.move(0, -1, this);
        if (event.key === "ArrowDown") this.player.move(0, 1, this);
        if (event.key === "ArrowLeft") this.player.move(-1, 0, this);
        if (event.key === "ArrowRight") this.player.move(1, 0, this);

        this.draw();
    }
}
const maps = {
    "spawn_map": [
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WarpTile("g8", { x: 7, y: 10 }, "ground"), new WarpTile("g8", { x: 8, y: 10 }, "ground"), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WarpTile("sword_cave", { x: 8, y: 10 }, "cave"), new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile()],
        [new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()]
    ],
    "sword_cave": [
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new GroundTile('cave'), new GroundTile('cave'), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WarpTile("spawn_map", { x: 4, y: 1 }, "cave"), new WarpTile("spawn_map", { x: 4, y: 1 }, "cave"), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()]
    ],
    "g8": [
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile()],
        [new WallTile(), new GroundTile(), new GroundTile(), new WallTile(), new GroundTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new GroundTile(), new GroundTile(), new WallTile()],
        [new WarpTile("g7", { x: 0, y: 4 }, "ground"), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WarpTile("g9", { x: 15, y: 4 }, "ground")],
        [new WarpTile("g7", { x: 0, y: 5 }, "ground"), new GroundTile(), new GroundTile(), new WallTile(), new GroundTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new GroundTile(), new GroundTile(), new WarpTile("g9", { x: 15, y: 5 }, "ground")],
        [new WarpTile("g7", { x: 0, y: 5 }, "ground"), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WarpTile("g9", { x: 15, y: 6 }, "ground")],
        [new WallTile(), new GroundTile(), new GroundTile(), new WallTile(), new GroundTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new GroundTile(), new GroundTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WarpTile("spawn_map", { x: 7, y: 0 }, "ground"), new WarpTile("spawn_map", { x: 8, y: 0 }, "ground"), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()]
    ],
};

window.onload = () => {
    const game = new Game("gameCanvas");
};

