import ASSETS from '../assets.js';

export default class ButterflyFlying extends Phaser.Physics.Arcade.Sprite {
    health = 1; // enemy health
    appetit = 100; //butterfly appetit
    isButine = false; //butterfly appetit
    fireCounterMin = 100; // minimum fire rate
    fireCounterMax = 300; // maximum fire rate
    fireCounter;
    power = 1; // enemy strength

    // path coordinates for enemy to follow
    paths = [
        [[200, -50], [1080, 160], [200, 340], [1080, 520], [200, 700], [1080, 780]],
        [[-50, 200], [1330, 200], [1330, 400], [-50, 400], [-50, 600], [1330, 600]],
        [[-50, 360], [640, 50], [1180, 360], [640, 670], [50, 360], [640, 50], [1180, 360], [640, 670], [-50, 360]],
        [[1330, 360], [640, 50], [50, 360], [640, 670], [1180, 360], [640, 50], [50, 360], [640, 670], [1330, 360]],
    ]

    constructor(scene, butterflyId, pathId, speed, power) {
        const startingId = 12;
        super(scene, 500, 500, 'papi'+butterflyId);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.power = power;
        this.fireCounter = Phaser.Math.RND.between(this.fireCounterMin, this.fireCounterMax); // random firing interval
        //this.setFlipY(true); // flip image vertically
        this.setDepth(70);
        this.scene = scene;

        this.initPath(pathId, speed); // choose path to follow

        this.text = scene.add.text(10, 100, '', { font: '16px Courier', fill: '#020202ff' });

    }

    preUpdate(time, delta) {
        //if (this.chain1 && this.chain1.data) this.debugTweenData(this.text, this.chain1.data[0]);

        super.preUpdate(time, delta);
        if(this.isButine) return;//stop quand le papillon butine
        if (this.pathIndex > 1) return; // stop updating if reached end of path

        this.path.getPoint(this.pathIndex, this.pathVector); // get current coordinate based on percentage moved

        this.setPosition(this.pathVector.x, this.pathVector.y); // set position of this enemy

        this.pathIndex += this.pathSpeed; // increment percentage moved by pathSpeed

        if (this.pathIndex > 1) this.die();

        // update firing interval
        if (this.fireCounter > 0) this.fireCounter--;
        else {
            this.fire();
        }
    }

    hit(damage) {
        this.health -= damage;

        if (this.health <= 0) this.die();
    }

    die() {
        this.scene.addExplosion(this.x, this.y);
        this.scene.removeEnemy(this);
    }

    fire() {
        return false; // butterflies don't shoot
        this.fireCounter = Phaser.Math.RND.between(this.fireCounterMin, this.fireCounterMax);
        this.scene.fireEnemyBullet(this.x, this.y, this.power);
    }

    initPath(pathId, speed) {
        const points = this.paths[pathId];

        this.path = new Phaser.Curves.Spline(points);
        this.pathVector = new Phaser.Math.Vector2(); // current coordinates along path in pixels
        this.pathIndex = 0; // percentage of position moved along path, 0 = beginning, 1 = end
        this.pathSpeed = speed; // speed of movement

        this.path.getPoint(0, this.pathVector); // get coordinates based on pathIndex

        this.setPosition(this.pathVector.x, this.pathVector.y);
    }

    getPower() {
        return this.power;
    }

    getAppetit() {
        return this.appetit;
    }    

    butine(docs,x,y) {
        this.isButine = true;
        this.setPosition(x, y);
        //

        this.chain1 = this.scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    y: y+1,
                    scaleX: 0.3,
                    scale7: 0.3,
                    duration: 300,
                    ease: 'quad.out'
                },
                {
                    y: y-1,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 300,
                    ease: 'bounce.out'
                },
            ],
            repeat: docs.length/2,
            repeatDelay: 300,
            onComplete: () => this.endButine(),
            onUpdate: tween =>
            {
                debugTweenData(this.text, tween.data[0]);
            }
        });        
        //remplace les couleurs par les images des docs
        console.log(docs); 
    }

debugTweenData(text, tweenData) {
        var output = [];

        var TDStates = [
            'CREATED',
            'INIT',
            'DELAY',
            'OFFSET_DELAY',
            'PENDING_RENDER',
            'PLAYING_FORWARD',
            'PLAYING_BACKWARD',
            'HOLD_DELAY',
            'REPEAT_DELAY',
            'COMPLETE'
        ];

        output.push(tweenData.key);
        output.push('--------');
        output.push('State: ' + TDStates[tweenData.state]);
        output.push('Start: ' + tweenData.start);
        output.push('Current: ' + tweenData.current);
        output.push('End: ' + tweenData.end);
        output.push('Progress: ' + tweenData.progress);
        output.push('Elapsed: ' + tweenData.elapsed);
        output.push('Duration: ' + tweenData.duration);
        output.push('Total Duration: ' + tweenData.totalDuration);
        output.push('Delay: ' + tweenData.delay);
        output.push('Yoyo: ' + tweenData.yoyo);
        output.push('Hold: ' + tweenData.hold);
        output.push('Repeat: ' + tweenData.repeat);
        output.push('Repeat Counter: ' + tweenData.repeatCounter);
        output.push('Repeat Delay: ' + tweenData.repeatDelay);

        text.setText(output);
    }

    endButine() {
        this.isButine = false;
    }

    remove() {
        this.scene.removeEnemy(this);
    }

    
}