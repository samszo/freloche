import ASSETS from '../assets.js';
import chaoticumPapillonae from '../gameObjects/chaoticumPapillonae.js';
import chaoticumFlower from '../gameObjects/chaoticumFlower.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        const centreX = this.scale.width * 0.5;
        const centreY = this.scale.height * 0.5;

        const barWidth = 468;
        const barHeight = 32;
        const barMargin = 4;
        //  We loaded this image in our Boot Scene, so we can display it here

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(centreX, centreY, barWidth, barHeight).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(centreX - (barWidth * 0.5) + barMargin, centreY, barMargin, barHeight - barMargin, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = barMargin + ((barWidth - (barMargin * 2)) * progress);

        });
    }

    preload() {
        //  Load the assets for the game - see ./src/assets.js
        for (let type in ASSETS) {
            for (let key in ASSETS[type]) {
                switch (key) {
                    case 'programmes':
                        this.load.json(ASSETS[type][key].key, ASSETS[type][key].url);
                        this.load.on("filecomplete-json-"+ASSETS[type][key].key, (key, type, data) => {
                            //regroupe les programmes par thème
                            let themes = d3.group(data, d => d["dcterms:date"][0]);
                            this.registry.set('themes', themes);
                            //charge les images des items   
                            themes.forEach((docs,i) => {
                                let id = key+i;
                                /*recalcule la dimension avec IIIF
                                TROP LONG
                                url = "http://localhost/omk_creationsp8/iiif/3/"+e["o:media/o:id"][0]+"/full/100,/0/default.png";
                                */
                                //récupère les infos IIIF pour avoir les dimensions dans la fleur
                                Promise.all(docs.map(d=>d3.json("http://localhost/omk_creationsp8/iiif/3/"+d["o:media/o:id"][0]+"/info.json"))).then((values) => {
                                    //construction de la fleur
                                    console.log(values); // [3, 1337, "foo"]
                                    let cf = new chaoticumFlower({'width':300,'height':300,'id':id,'photos':values}),
                                    blob = new Blob([cf.toString()], { type: 'image/svg+xml' }),
                                    url = URL.createObjectURL(blob);
                                    this.load['svg'].apply(this.load, [id,url,ASSETS[type][key].args]);                                
                                });

                                /*charge la photo comme une image
                                url = e["o:media/file"][0].replace("original","medium");
                                this.load["image"].apply(this.load, [id,url,ASSETS[type][key].args]);   
                                */
                            });
                        });
                        break;
                    case 'papi':
                    //case 'flower':
                        for (let index = 0; index < ASSETS[type][key].nb; index++) {
                            let id = key+index,
                                cp = key == 'papi' ? 
                                    new chaoticumPapillonae({'width':100,'height':100,'id':id})
                                    : new chaoticumFlower({'width':100,'height':100,'id':id}),
                                blob = new Blob([cp.toString()], { type: 'image/svg+xml' }),
                                url = URL.createObjectURL(blob);
                            this.load['svg'].apply(this.load, [id,url,ASSETS[type][key].args]);
                        }                        
                        break;
                    default:
                        let args = ASSETS[type][key].args.slice();
                        args.unshift(ASSETS[type][key].key);
                        this.load[type].apply(this.load, args);
                        break;
                }
            }
        }
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
    }
}
