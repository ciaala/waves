/**
 * Created by cryptq on 1/21/17.
 */
define('Waves', ['Phaser'], function (Phaser) {
    function memcpy(dst, dstOffset, src, srcOffset, length) {
        var dstU8 = new Uint8Array(dst, dstOffset, length);
        var srcU8 = new Uint8Array(src, srcOffset, length);
        dstU8.set(srcU8);
    };


    var Wave = function (game) {
        this.game = game;
        this.startPosition = [game.rnd.integerInRange(0, game.width),
            game.rnd.integerInRange(0, game.height)];


        this.stopPosition = [];
        this.stopPosition[0] = game.rnd.integerInRange(-this.game.height / 4, this.game.height / 4) + this.startPosition[0];
        var distance = (this.game.height / 4) - Math.abs(this.startPosition[0] - this.stopPosition[0]);
        this.stopPosition[1] = game.rnd.integerInRange(-distance, distance) + this.startPosition[1];

        var sign = game.rnd.sign();
        var dy = (this.stopPosition[1] - this.startPosition[1]);
        var dx = (this.stopPosition[0] - this.startPosition[0]);
        this.direction = [
            sign * dy / (dx * dy),
            -sign * dx / (dx * dy)
        ];
        this.speed = game.rnd.realInRange(1, 1.5);
    };

    Wave.prototype.update = function (elapsedTime) {
        this.startPosition[0] += this.direction[0] * this.speed * elapsedTime;
        this.startPosition[1] += this.direction[1] * this.speed * elapsedTime;
        this.stopPosition[0] += this.direction[0] * this.speed * elapsedTime;
        this.stopPosition[1] += this.direction[1] * this.speed * elapsedTime;

    };

    Wave.prototype.draw = function (bitmapCloned) {
        if (this.grandPosition) {
            bitmapCloned.line(
                this.grandPosition[0],
                this.grandPosition[1],
                this.grandPosition[2],
                this.grandPosition[3],
                '#44f', 16);
        } else {
            this.grandPosition = [];
        }


        if (this.previousPosition) {
            bitmapCloned.line(
                this.previousPosition[0],
                this.previousPosition[1],
                this.previousPosition[2],
                this.previousPosition[3],
                '#88f', 4);
            this.grandPosition[0] = this.previousPosition[0];
            this.grandPosition[1] = this.previousPosition[1];
            this.grandPosition[2] = this.previousPosition[2];
            this.grandPosition[3] = this.previousPosition[3];
        } else {
            this.previousPosition = [];
        }
        this.previousPosition[0] = this.startPosition[0];
        this.previousPosition[1] = this.startPosition[1];
        this.previousPosition[2] = this.stopPosition[0];
        this.previousPosition[3] = this.stopPosition[1];

        bitmapCloned.line(
            this.startPosition[0],
            this.startPosition[1],
            this.stopPosition[0],
            this.stopPosition[1],
            '#bbf', 1);

        /*
         var x = 0;
         var j = 0;
         var dx = (this.startPosition[0] - this.stopPosition[0]) > 0 ? 1 : -1;
         var dy = this.startPosition[1] - this.stopPosition[1];
         //dx = dx / Math.abs(dx)
         for (x = this.startPosition[0]; x < this.stopPosition[0]; x += dx) {
         var y = ((dx * i ) / dy) + this.startPosition[1];
         this.waterSpray(x, y);
         }
         */
        /*this.game.line(this.startPosition[0],
         this.startPosition[1],
         this.stopPosition[0],
         this.stopPosition[1],
         '#ddf', 4);*/
        // var l = this.game.Line(0, 0, this.game.width, this.game.height, '#ccf', this.game.rnd.integerInRange(0,10));
        //l.addToWorld();
    };
    Wave.prototype.waterSpray = function (bitMapCloned, x, y) {
        bitmapCloned.line(
            this.startPosition[0],
            this.startPosition[1],
            this.stopPosition[0],
            this.stopPosition[1],
            '#ddf', 4);
    };
    Wave.prototype.isAlive = function () {
        if ((this.startPosition[0] < 0) || (this.startPosition[0] > this.game.width)) {
            if ((this.stopPosition[0] < 0) || (this.stopPosition[0] > this.game.width)) {
                if ((this.startPosition[1] < 0) || (this.startPosition[1] > this.game.width)) {
                    if ((this.stopPosition[1] < 0) || (this.stopPosition[1] > this.game.width)) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    var TentacleFactory = function (game) {
        this.game = game;
        this.game.load.atlasJSONHash('tentacle', 'rsc/tentacle.png', 'rsc/tentacle.json');
    };

    TentacleFactory.prototype.createSprite = function (x, y) {
        var sprite = this.game.add.sprite(x, y, 'tentacle');
        var frames = Phaser.Animation.generateFrameNames("tentacle", 1, 6);
        sprite.animations.add("idle", frames);
        sprite.animations.play("idle", 5, true);
        return sprite;
    };

    var Waves = function () {
        this.game = new Phaser.Game(window.innerWidth,
            window.innerHeight, Phaser.AUTO, 'Waves', this);
        this.waves = [];

    };
    Waves.prototype.phaser = Phaser;
    Waves.prototype.preload = function () {
        this.game.load.atlasJSONHash('boat', 'rsc/boat.png', 'rsc/boat.json');
        this.tentacleSpriteFactory = new TentacleFactory(this.game);

    };
    Waves.prototype.update = function () {
        var elapsedTime = performance.now() - this.oldClick;
        elapsedTime = elapsedTime < 30 ? elapsedTime : 30;
        this.updateWaves(elapsedTime);
        this.oldClick = performance.now();

        this.originalSurface.moveH(this.game.rnd.integerInRange(-2, 0));
        this.seaSurface.copy(this.originalSurface);
        this.drawWaves(this.seaSurface);
        //this.seaSurface.line(0, 0, this.game.width, this.game.height, '#ccf', this.game.rnd.integerInRange(0,10));

    };
    Waves.prototype.updateWaves = function (elapsedTime) {
        var wave = null;
        var i = 0;
        for (i = 0; i < this.waves.length; i++) {
            wave = this.waves[i];
            wave.update(elapsedTime);
            /*
             if (wave.isAlive()) {
             wave.draw(this.seaSurface);
             }
             this.seaSurface.update();
             */
        }
        for (i = 0; i < this.waves.length; i++) {
            wave = this.waves[i];
            if (!wave.isAlive()) {
                this.waves.splice(i);
            }
        }
    };
    Waves.prototype.drawWaves = function (bitmapData) {
        var wave = null;
        var i = 0;
        for (i = 0; i < this.waves.length; i++) {
            wave = this.waves[i];
            if (wave.isAlive()) {
                wave.draw(bitmapData);
            }

        }
    };
    Waves.prototype.render = function () {
        /*
         //this.seaSurface.addToWorld();
         //this.game.debug.inputInfo(32, 32);
         //this.game.debug.animation.(32,200);
         //console.log("waves: #" + this.waves.length);
         var wave = null;
         var i = 0;

         }
         this.seaSurface.update();
         */

    };

    Waves.prototype.setupBoatAnimation = function () {
        this.boatSprite = this.game.add.sprite(20, 20, 'boat');
        //boatSprite.animations.add("left", Phaser.Animation.generateFrameNames('walk',19,27));
        this.boatSprite.animations.add("top", Phaser.Animation.generateFrameNames('sprite', 1, 8));
        this.boatSprite.animations.add("top-right", Phaser.Animation.generateFrameNames('sprite', 9, 16));
        this.boatSprite.animations.add("right", Phaser.Animation.generateFrameNames('sprite', 17, 24));
        this.boatSprite.animations.add("right-bottom", Phaser.Animation.generateFrameNames('sprite', 25, 32));
        this.boatSprite.animations.add("bottom", Phaser.Animation.generateFrameNames('sprite', 33, 40));
        this.boatSprite.animations.add("bottom-left", Phaser.Animation.generateFrameNames('sprite', 41, 48));
        this.boatSprite.animations.add("left", Phaser.Animation.generateFrameNames('sprite', 49, 56));
        this.boatSprite.animations.add("top-left", Phaser.Animation.generateFrameNames('sprite', 57, 64));

    };

    Waves.prototype.setupSeaSurface = function () {
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
            //this.seaSurface.line(0, 0, this.game.width, this.game.height, '#ccf', 4);

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
        this.originalSurface = this.game.make.bitmapData(this.seaSurface.width, this.seaSurface.height);
        this.originalSurface.copy(this.seaSurface);
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
        this.setupSeaSurface();
        var t1 = performance.now();
        console.log(t1 - t0);
        this.setupBoatAnimation();
        this.setupInput();
        // this.addQuake();
        this.spawnTimeoutTime = 1000;
        this.spawnTimeout = setTimeout(spawnMonsterCallback, this.spawnTimeoutTime, this);
        this.oldClick = performance.now();
    };
    var spawnMonsterCallback = function (wavesObject) {
        wavesObject.spawnMonster();
        wavesObject.spawnWaves();
        wavesObject.spawnTimeout = setTimeout(spawnMonsterCallback, wavesObject.spawnTimeoutTime, wavesObject);

    };

    Waves.prototype.spawnMonster = function () {
        this.tentacleSpriteFactory.createSprite(
            this.game.rnd.integerInRange(0, this.game.width),
            this.game.rnd.integerInRange(0, this.game.height)
        );

    };

    Waves.prototype.spawnWaves = function () {
        if (this.waves.length < 5) {
            this.waves[this.waves.length] = new Wave(this.game);
        }
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