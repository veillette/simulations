import Sun from 'models/body/sun';
import Planet from 'models/body/planet';
import Moon from 'models/body/moon';
import Satellite from 'models/body/satellite';
import Assets from 'common/v3/pixi/assets';

Assets.Path = 'img/';

Assets.Images = {
    PLANET:       'planet.png',
    EARTH:        'earth.png',
    SUN:          'sun.png',
    MOON:         'moon.png',
    MOON_GENERIC: 'moon-generic.png',
    SATELLITE:    'phet/space-station.png',
    EXPLOSION:    'explosion.png'
};

Assets.SpriteSheets = {};

Assets.ImageFromModel = function(modelInstance) {
    if (modelInstance instanceof Sun)
        return Assets.Images.SUN;
    if (modelInstance instanceof Planet)
        return Assets.Images.EARTH;
    if (modelInstance instanceof Moon)
        return Assets.Images.MOON;
    if (modelInstance instanceof Satellite)
        return Assets.Images.SATELLITE;
    return Assets.Images.EARTH;
};

export default Assets;
