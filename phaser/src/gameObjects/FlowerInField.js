import ASSETS from '../assets.js';

export default class FlowerInField extends Phaser.Physics.Arcade.Sprite {
    health = 100; // enemy health
    butterflyButine = false; // butterfly is currently butining a flower
    butterflyCounter=0;
    collection;
    id

    // positions for flower
    posis = [
        [[200, -50], [1080, 160], [200, 340], [1080, 520], [200, 700], [1080, 780]],
        [[-50, 200], [1330, 200], [1330, 400], [-50, 400], [-50, 600], [1330, 600]],
        [[-50, 360], [640, 50], [1180, 360], [640, 670], [50, 360], [640, 50], [1180, 360], [640, 670], [-50, 360]],
        [[1330, 360], [640, 50], [50, 360], [640, 670], [1180, 360], [640, 50], [50, 360], [640, 670], [1330, 360]],
    ]

    constructor(scene, collection, id, x, y, posiId=-1) {
        const startingId = 12;
        super(scene, 500, 500, collection+id);
        this.collection = collection;
        this.id = id;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(70);
        this.scene = scene;

        this.initPosi(x, y, posiId); // choose position
    }

    
    hit(appetit) {
        this.health -= appetit;
        this.butterflyButine = true; // butterfly is currently butining a flower
        this.butterflyCounter ++;
        if (this.health <= 0) this.die();
    }

    die() {
        this.scene.addExplosion(this.x, this.y);
    }
    initPosi(x, y, posiId) {
        //const points = this.posis[posiId];
        this.setPosition(x, y);
    }

    isButine() {
        return this.butterflyButine;
    }

    getDocs() {
        return ASSETS.json[this.collection].themes[this.id][1];
    }

    remove() {
        this.scene.removeFlower(this);
    }
}