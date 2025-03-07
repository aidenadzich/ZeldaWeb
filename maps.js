import { Game } from "./script.js";

export const maps = {
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