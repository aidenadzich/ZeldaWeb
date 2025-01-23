class MainMenu {
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.menuTexture = new Image();
        this.menuTexture.src = './images/main_menu.bmp'; // Path to your main menu sprite
        this.menuTexture.onload = () => this.renderMenu();
        this.eventListenerAttached = false;
    }

    show() {
        if (!this.eventListenerAttached) {
            window.addEventListener("keydown", this.handleKeydown.bind(this)); // Ensure `this` is bound
            this.eventListenerAttached = true;
        }
        this.renderMenu();
    }

    handleKeydown(event) {
        if (event.key === "Enter") {
            this.game.switchMap("spawn_map"); // Switch to spawn_map
        }
    }

    renderMenu() {
        const { ctx, canvas, menuTexture } = this;

        // Clear the canvas and draw the menu texture
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(menuTexture, 0, 0, canvas.width, canvas.height); // You can adjust the drawing as needed
    }
}

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
        this.mainMenu = new MainMenu(this); // Initialize the main menu
        this.loadMap(this.currentMap).catch(error => {
            console.error("Failed to fetch map data:", error);
        });
    }
    

    loadImages() {

        this.worldSpritesheet = new Image();
        this.worldSpritesheet.src = "images/sprites.bmp";
        this.worldSpritesheet.onload = () => this.start();
        this.worldSpritesheet.onerror = () => console.error("Error loading sprites.bmp");

        this.playerSpritesheet = new Image();
        this.playerSpritesheet.src = "images/player_sprites.bmp";
        this.playerSpritesheet.onload = () => this.start();
        this.playerSpritesheet.onerror = () => console.error("Error loading player_sprites.bmp");

        this.storySpritesheet = new Image();
        this.storySpritesheet.src = "images/story_sprites.bmp";
        this.storySpritesheet.onload = () => this.start();
        this.storySpritesheet.onerror = () => console.error("Error loading story_sprites.bmp");

        this.worldSpriteMap = {
            
            wall: { x: 355, y: 96, width: 16, height: 16 },
            wallTopRight: { x: 338, y: 96, width: 16, height: 16 },
            wallTopLeft: { x: 370, y: 96, width: 16, height: 16 },
            wallBottomRight: { x: 306, y: 96, width: 16, height: 16 },
            wallBottomLeft: { x: 322, y: 96, width: 16, height: 16 },
            wallTop:{ x: 314, y: 96, width: 16, height: 16 },

            greenBush: { x: 290, y: 96, width: 16, height: 16 },

            ground: { x: 0, y: 143, width: 16, height: 16 },
            cave: { x: 136, y: 194, width: 16, height: 16 },
            caveWall: { x: 119, y: 211, width: 16, height: 16 },
        }

        this.playerSpriteMap = {
            player: { x: 1, y: 11, width: 16, height: 16 }, 
        }
        
        this.storySpriteMap = {
            main: { x: 1, y: 11, width: 256, height: 224 }, 
        }
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
        if (this.mainMenu.show == false) { // If we are on the main game map, render the tiles
            map.forEach((row, rowIndex) => {
                row.forEach((tile, colIndex) => {
                    const x = colIndex * TILE_SIZE;
                    const y = rowIndex * TILE_SIZE;

                    if (tile instanceof GroundTile || tile instanceof WallTile || tile instanceof WarpTile) {
                        const texture = images[tile.texture] || images.ground; // Default to ground if texture is missing
                        const sprite = this.worldSpriteMap[tile.texture] || this.worldSpriteMap.ground;
                        ctx.drawImage(
                            this.worldSpritesheet, 
                            sprite.x, sprite.y, sprite.width, sprite.height, 
                            x, y, TILE_SIZE, TILE_SIZE
                        );
                    }
                });
            });

            const playerSprite = this.playerSpriteMap.player;
            ctx.drawImage(
                this.playerSpritesheet, 
                playerSprite.x, playerSprite.y, playerSprite.width, playerSprite.height,
                player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE
            );
        } else {
            // Show the main menu
            this.mainMenu.show();
        }
    }

    async start() {
        if (!this.eventListenerAttached) {
            window.addEventListener("keydown", this.handleKeydown.bind(this)); // Ensure `this` is bound
            this.eventListenerAttached = true;
        }

        // Show the main menu at the start
        const mainMenuMusic = new Audio('./music/mOverworld.mp3');
        mainMenuMusic.loop = true;
        mainMenuMusic.play();
        this.mainMenu.show();

        

    }
    
    async musicControl() {
        
    }

    handleKeydown(event) {
        if (event.key === "ArrowUp") this.player.move(0, -1, this);
        if (event.key === "ArrowDown") this.player.move(0, 1, this);
        if (event.key === "ArrowLeft") this.player.move(-1, 0, this);
        if (event.key === "ArrowRight") this.player.move(1, 0, this);
        if (event.key === "Enter") this.mainMenu.show = false;

        this.draw();
    }
}
const maps = {
    "spawn_map": [
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WarpTile("g8", { x: 7, y: 10 }, ""), new WarpTile("g8", { x: 8, y: 10 }, ""), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WarpTile("sword_cave", { x: 8, y: 10 }, "cave"), new WallTile(), new WallTile('wallTopLeft'), new GroundTile(), new GroundTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile('wallTopLeft'), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile('wallTopLeft'), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile('wallTopLeft'), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile('wallTopRight'), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WarpTile("h7", { x: 0, y: 5 }, ""), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WarpTile("h9", { x: 15, y: 5 }, "")],
        [new WallTile('wallTop'), new WallTile('wallBottomLeft'), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile('wallTop'), new WallTile('wallTop')],
        [new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()]
    ],
    "sword_cave": [
        [new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall')],
        [new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall')],
        [new WallTile('caveWall'), new WallTile('caveWall'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile('caveWall'), new WallTile('caveWall')],
        [new WallTile('caveWall'), new WallTile('caveWall'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile('caveWall'), new WallTile('caveWall')],
        [new WallTile('caveWall'), new WallTile('caveWall'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile('caveWall'), new WallTile('caveWall')],
        [new WallTile('caveWall'), new WallTile('caveWall'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile('caveWall'), new WallTile('caveWall')],
        [new WallTile('caveWall'), new WallTile('caveWall'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile('caveWall'), new WallTile('caveWall')],
        [new WallTile('caveWall'), new WallTile('caveWall'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile('caveWall'), new WallTile('caveWall')],
        [new WallTile('caveWall'), new WallTile('caveWall'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new GroundTile('cave'), new WallTile('caveWall'), new WallTile('caveWall')],
        [new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new GroundTile('cave'), new GroundTile('cave'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall')],
        [new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new GroundTile('cave'), new GroundTile('cave'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall')],
        [new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WarpTile("spawn_map", { x: 4, y: 1 }, "cave"), new WarpTile("spawn_map", { x: 4, y: 1 }, "cave"), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall'), new WallTile('caveWall')]
    ],
    "g8": [
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile('wallTopLeft'), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile('wallTopRight'), new WallTile('wallTopLeft'), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile('wallTopRight'), new WallTile()],
        [new WallTile('wallTopLeft'), new GroundTile(), new GroundTile(), new WallTile('greenBush'), new GroundTile(), new WallTile('greenBush'), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile('greenBush'), new GroundTile(), new GroundTile(), new WallTile('wallTopRight')],
        [new WarpTile("g7", { x: 15, y: 4 }, ""), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WarpTile("g9", { x: 0, y: 4 }, "")],
        [new WarpTile("g7", { x: 15, y: 5 }, ""), new GroundTile(), new GroundTile(), new WallTile('greenBush'), new GroundTile(), new WallTile('greenBush'), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile('greenBush'), new GroundTile(), new GroundTile(), new WarpTile("g9", { x: 0, y: 5 }, "")],
        [new WarpTile("g7", { x: 15, y: 6 }, ""), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WarpTile("g9", { x: 0, y: 6 }, "")],
        [new WallTile('wallBottomLeft'), new GroundTile(), new GroundTile(), new WallTile('greenBush'), new GroundTile(), new WallTile('greenBush'), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile('greenBush'), new GroundTile(), new GroundTile(), new WallTile('wallBottomRight')],
        [new WallTile(), new WallTile('wallBottomLeft'), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile('wallBottomRight'), new WallTile('wallBottomLeft'), new GroundTile(), new GroundTile(), new GroundTile(), new WallTile('wallBottomRight'), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new GroundTile(), new GroundTile(), new WallTile(), new WallTile(), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile('wallTop'), new WallTile(), new WallTile()],
        [new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WarpTile("spawn_map", { x: 7, y: 0 }, ""), new WarpTile("spawn_map", { x: 8, y: 0 }, ""), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile(), new WallTile()]
    ],

};

window.onload = () => {
    const game = new Game("gameCanvas");
};

