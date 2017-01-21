/**
 * Created by cryptq on 1/21/17.
 */
define('Waves', ['Phaser'], function (Phaser) {
    var Waves = function () {
        this.game = new Phaser.Game(window.innerWidth,
            window.innerHeight, Phaser.AUTO, 'Waves', this);

    };
    Waves.prototype.phaser = Phaser;
    Waves.prototype.preload = function () {
        //this.game.load.spritesheet('boat','rsc/boat.png', 61, 57, 45);
        this.game.load.atlasJSONHash('boat', 'rsc/boat.png', 'rsc/boat.json');
    };
    Waves.prototype.update = function () {
    };
    Waves.prototype.render = function () {
        //this.game.debug.inputInfo(32, 32);
        //this.game.debug.animation.(32,200);
    };
    Waves.prototype.setupBoatAnimation = function () {
        this.boatSprite = this.game.add.sprite(20, 20, 'boat');
        //boatSprite.animations.add("left", Phaser.Animation.generateFrameNames('walk',19,27));
        this.boatSprite.animations.add("top", Phaser.Animation.generateFrameNames('sprite', 2, 9));
        this.boatSprite.animations.add("top-right", Phaser.Animation.generateFrameNames('sprite', 10, 18));
        this.boatSprite.animations.add("right", Phaser.Animation.generateFrameNames('sprite', 20, 27));
        this.boatSprite.animations.add("right-bottom", Phaser.Animation.generateFrameNames('sprite', 29, 36));
        this.boatSprite.animations.add("bottom", Phaser.Animation.generateFrameNames('sprite', 38, 45));
        this.boatSprite.animations.play("right", 5, true);
    };
    Waves.prototype.setupSeaWaves = function () {
        this.sea = [];
        this.sea.surface = {};
        this.sea.surface = {};

    };
    Waves.prototype.create = function () {
        this.game.stage.backgroundColor = '#2d2d2d';
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
        this.game.input.onDown.add(this.goFull, this);
        this.setupBoatAnimation();
        this.setupSeaWaves();
        //,60, true);

        //sprite.animations.add("rotate", Phaser.Animation.generateFrameNames('walk',19,27))
        this.game.add.tween(this.boatSprite).to({
            x: this.game.width / 2,
            y: this.game.height / 2
        }, 10000, Phaser.Easing.Linear.None, true);
    };
    Waves.prototype.goFull = function () {
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        }
        else {
            this.game.scale.startFullScreen(false);
        }
    };

    Waves.prototype.addQuake = function() {

        // define the camera offset for the quake
        var rumbleOffset = 10;

        // we need to move according to the camera's current position
        var properties = {
            x: game.camera.x - rumbleOffset
        };

        // we make it a relly fast movement
        var duration = 100;
        // because it will repeat
        var repeat = 4;
        // we use bounce in-out to soften it a little bit
        var ease = Phaser.Easing.Bounce.InOut;
        var autoStart = false;
        // a little delay because we will run it indefinitely
        var delay = 1000;
        // we want to go back to the original position
        var yoyo = true;

        var quake = game.add.tween(game.camera)
            .to(properties, duration, ease, autoStart, delay, 4, yoyo);

        // we're using this line for the example to run indefinitely
        quake.onComplete.addOnce(addQuake);

        // let the earthquake begins
        quake.start();
    }
    return Waves;
});