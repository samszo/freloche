import ASSETS from '../assets.js';
import ANIMATION from '../animation.js';

export default class Butinage extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, ASSETS.spritesheet.tiles.key, 4);

        scene.add.existing(this);

        this.setDepth(100);
        this.anims.play(ANIMATION.butinage.key);

        // cleanup after animation completes
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
            this.destroy();
        }, this);
    }
}