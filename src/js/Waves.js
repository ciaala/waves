/**
 * Created by cryptq on 1/21/17.
 */
define('Waves', ['Phaser'], function (Phaser) {
    function memcpy(dst, dstOffset, src, srcOffset, length) {
        var dstU8 = new Uint8Array(dst, dstOffset, length);
        var srcU8 = new Uint8Array(src, srcOffset, length);
        dstU8.set(srcU8);
    };
    var Waves = function () {
        this.game = new Phaser.Game(window.innerWidth,
            window.innerHeight, Phaser.WEBGL, 'Waves', this);

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
        this.boatSprite.animations.add("left", Phaser.Animation.generateFrameNames('sprite', 56, 63));

    };

    Waves.prototype.setupSeaWaves = function () {
        this.seaSurface = this.game.make.bitmapData(this.game.width, this.game.height);
        //var colors = Phaser.Color.HSVColorWheel();

        //this.seaSurface.fill(220, 0, 0);
        //this.seaSurface.circle(20, 20, 10, colors[180].rgba);
        //this.seaSurface.update();

        var arrayPixels = function () {
            this.seaPixels = new Uint32Array(this.seaSurface.pixels.length + 120);
            for (var i = 0; i < this.seaPixels.length; i++) {
                var light = this.game.rnd.integerInRange(0, 64);
                this.seaPixels[i] = (255 << 24) | ((192 + light) << 16) | (light << 8) | light;
            }
            var end = this.seaPixels.length - 120;
            //this.seaSurface.pixels = this.seaPixels.subarray(0, end);
            memcpy(this.seaSurface.pixels, 0, this.seaPixels, 0, 4 * end);
            this.seaSurface.dirty = true;
            this.seaSurface.setPixel32(0, 0, light, light, 192 + light, 255, true);
        };
        var fastDirectPixels = function () {
            for (var i = 0; i < this.seaSurface.pixels.length; i++) {
                var light = this.game.rnd.integerInRange(0, 64);
                this.seaSurface.pixels[i] = (255 << 24) | ((192 + light) << 16) | (light << 8) | light;
            }
            this.seaSurface.setPixel32(0, 0, light, light, 192 + light, 255, true);
        };
        var fastSetPixels = function () {
            for (var x = 0; x < this.game.width; x++) {
                for (var y = 0; y < this.game.height; y++) {
                    var light = this.game.rnd.integerInRange(0, 64);
                    this.seaSurface.setPixel32(x, y, light, light, 192 + light, 255, false);
                }
            }
            this.seaSurface.setPixel32(0, 0, light, light, 192 + light, 255, true);
        };

        var slowProcessPixels = function () {
            var c = {a: 255, g: 0, b: 192, r: 0};
            this.seaSurface.processPixelRGB(function (pixel, tx, ty) {
                var light = this.game.rnd.integerInRange(0, 64);
                c.r = light;
                c.b = 192 + light;
                c.g = light;
                return c;
            }, this);
        };
        // fastSetPixels.call(this);
        fastDirectPixels.call(this);
        // arrayPixels.call(this);
        //this.seaSurface.update();
        this.seaSurface.addToWorld();
    };
    Waves.prototype.setupCamera = function () {
        this.game.stage.backgroundColor = '#8d2d2d';
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
        var margin = 50;
        // and set the world's bounds according to the given margin
        var x = -margin;
        var y = -margin;
        var w = this.game.world.width + margin * 2;
        var h = this.game.world.height + margin * 2;
        // it's not necessary to increase height, we do it to keep uniformity
        this.game.world.setBounds(x, y, w, h);
        this.game.world.camera.position.set(0);
        this.game.input.onDown.add(this.goFull, this);
    };
    Waves.prototype.moveBoatUp = function () {
        this.boatSprite.animations.stop(null, true);
        if (this.boatTween) {
            this.boatTween.stop();
        }
        this.boatSprite.animations.play("top", 5, true);
        this.boatTween = this.game.add.tween(this.boatSprite).to({
            y: 0,
        }, 10000, Phaser.Easing.Linear.None, true);
    };
    Waves.prototype.moveBoatLeft = function () {
        this.boatSprite.animations.stop(null, true);
        if (this.boatTween) {
            this.boatTween.stop();
        }
        this.boatSprite.animations.play("left", 5, true);
        this.boatTween = this.game.add.tween(this.boatSprite).to({
            x: 0,
        }, 10000, Phaser.Easing.Linear.None, true);
    };
    Waves.prototype.moveBoatRight = function () {
        this.boatSprite.animations.stop(null, true);
        if (this.boatTween) {
            this.boatTween.stop();
        }
        this.boatSprite.animations.play("right", 5, true);
        this.boatTween = this.game.add.tween(this.boatSprite).to({
            x: this.game.width,
        }, 10000, Phaser.Easing.Linear.None, true);
    };
    Waves.prototype.moveBoatDown = function () {
        this.boatSprite.animations.stop(null, true);
        if (this.boatTween) {
            this.boatTween.stop();
        }
        this.boatSprite.animations.play("bottom", 5, true);
        this.boatTween = this.game.add.tween(this.boatSprite).to({
            y: this.game.height,
        }, 10000, Phaser.Easing.Linear.None, true);

    };
    Waves.prototype.anchorBoat = function () {
        //this.boatSprite.animations.stop(null, true);
        if (this.boatTween) {
            this.boatTween.stop();
        }

    };
    Waves.prototype.shootBoat = function () {
        if (this.boatTween) {
            this.boatTween.stop();
        }
    };

    Waves.prototype.setupInput = function () {
        var keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyW.onDown.add(this.moveBoatUp, this);

        var keyA = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyA.onDown.add(this.moveBoatLeft, this);

        var keyS = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        keyS.onDown.add(this.moveBoatDown, this);

        var keyD = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        keyD.onDown.add(this.moveBoatRight, this);

        var keyE = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        keyE.onDown.add(this.anchorBoat, this);

        var keySpace = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        keySpace.onDown.add(this.shootBoat, this);
    };


    Waves.prototype.create = function () {

        this.setupCamera();
        var t0 = performance.now();
        this.setupSeaWaves();
        var t1 = performance.now();
        console.log(t1 - t0);
        this.setupBoatAnimation();
        this.setupInput();
        // this.addQuake();
    };
    Waves.prototype.goFull = function () {
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        } else {
            this.game.scale.startFullScreen(false);
        }
    };

    Waves.prototype.addQuake = function () {

        // define the camera offset for the quake
        var rumbleOffset = 10;

        // we need to move according to the camera's current position
        var properties = {
            x: this.game.camera.x - rumbleOffset
        };

        // we make it a really fast movement
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

        var quake = this.game.add.tween(this.game.camera)
            .to(properties, duration, ease, autoStart, delay, 4, yoyo);

        // we're using this line for the example to run indefinitely
        quake.onComplete.addOnce(this.addQuake, this);

        // let the earthquake begins
        quake.start();
    }
    return Waves;
});