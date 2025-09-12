export default {
    // 'audio': {
    //     score: {
    //         key: 'sound',
    //         args: ['assets/sound.mp3', 'assets/sound.m4a', 'assets/sound.ogg']
    //     },
    // },
    'json': {
         programmes: {
             key: 'programmes',
             url: 'http://localhost/omk_creationsp8/files/bulk_export/programme_de_l_universite_json-20250911-181502.table.json',
             args: {scale:1}
         },
    },
    'svg': {
         freloche: {
             key: 'freloche',
             args: ['assets/freloche.svg',{scale:0.2}]
         },
         logo: {
             key: 'logo',
             args: ['assets/logo-paragraphe-blanc.svg',{scale:0.5}]
         },
         papi: {
             key: 'papi',
             nb: 12,
             args: {scale:0.8}
         },
         /*
         flower: {
             key: 'flower',
             nb: 12,
             args: {scale:0.8}
         },
         */
    },
    'spritesheet': {
        ships: {
            key: 'ships',
            args: ['assets/ships.png', {
                frameWidth: 64,
                frameHeight: 64,
            }]
        },
        tiles: {
            key: 'tiles',
            args: ['assets/tiles.png', {
                frameWidth: 32,
                frameHeight: 32
            }]
        },
    }
};