var MM = {};

// event dispatcher
MM.events = _.extend({}, Backbone.Events);

MM.Config = {
    width: 600,
    height: 550,

    levels: null,

    baseTileSprite: 7,
    activeTileSprite: 2,
    errorTileSprite: 6,
    successTileSprite: 5
};

MM.GameLevel = function(gridSize, tiles, tileScore){
    this.gridSize = gridSize;
    this.tiles = tiles;
    this.tileScore = tileScore || 1;
};

MM.Config.levels = [
    new MM.GameLevel(6, 4),
    new MM.GameLevel(6, 5),
    new MM.GameLevel(6, 6),
    new MM.GameLevel(6, 7),
    new MM.GameLevel(6, 8),
    new MM.GameLevel(6, 9),
    new MM.GameLevel(6, 10),
    new MM.GameLevel(6, 11),
    new MM.GameLevel(6, 12),
    new MM.GameLevel(6, 13),
    new MM.GameLevel(6, 14),
    new MM.GameLevel(6, 15),
    new MM.GameLevel(6, 16),
    new MM.GameLevel(6, 17),
    new MM.GameLevel(6, 18),
    new MM.GameLevel(6, 19),
    new MM.GameLevel(6, 20)
];
