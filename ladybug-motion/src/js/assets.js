import Assets from 'common/v3/pixi/assets';

Assets.Path = 'img/';

Assets.Images = {
    LADYBUG: 'ladybug',
    LADYBUG_OPEN_WINGS: 'ladybug-open-wings'
};

Assets.SpriteSheets = {
    'ladybug.json': [
        Assets.Images.LADYBUG,
        Assets.Images.LADYBUG_OPEN_WINGS,
    ]
};

export default Assets;
