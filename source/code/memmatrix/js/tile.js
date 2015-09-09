MM.Tile = function(game, x, y, color) {
    _.extend(this, Backbone.Events);

    Phaser.Sprite.call(this, game, x, y, 'matrix', color);

//    this.listenTo(MM.events, "my-alert", function(msg) {
//        console.log("Triggered xyz " + msg);
//    });

    this.inputEnabled = true;
    this.input.pixelPerfectOver = true;

    // events
    this.events.onInputDown.add(this.onClick, this.sprite);
    this.events.onInputOver.add(this.onOver, this.sprite);
    this.events.onInputOut.add(this.onOut, this.sprite);

    // custom events
    // on: level-started, level-ended
};

MM.Tile.prototype = Object.create(Phaser.Sprite.prototype);
MM.Tile.prototype.constructor = MM.Tile;

MM.Tile.prototype.onOver = function(sprite) {
    if (sprite.game.userTurn && sprite.frame === MM.Config.baseTileSprite) {
        sprite.alpha = 0.5;
    }
};

MM.Tile.prototype.onOut = function(sprite) {
//    if (sprite.game.userTurn) {
        sprite.alpha = 1;
//    }
};

MM.Tile.prototype.onClick = function(sprite) {
    var currentLevel = sprite.game.currentLevel;
    var levels = sprite.game.levels;

    if (sprite.game.userTurn) {
        sprite.alpha = 1;
        if (sprite.visibleTile) {
            sprite.game.foundTiles++;
            sprite.game.score += levels[currentLevel].tileScore;
            if (sprite.game.foundTiles == levels[currentLevel].tiles) {
                sprite.frame = MM.Config.successTileSprite;
                sprite.game.score += (levels[currentLevel].tiles * levels[currentLevel].tileScore);
                sprite.game.startNextLevel();
            } else {
                sprite.frame = MM.Config.activeTileSprite;
            }
        } else {
            sprite.frame = MM.Config.errorTileSprite;
            sprite.game.restartCurrentLevel();
        }
    }
    sprite.game.updateScores = true;
};