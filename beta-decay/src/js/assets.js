import _ from 'underscore';
import Assets from 'nuclear-physics/assets';
import localImages from './assets-images';

// Prepend a path to the nuclear physics images before we add our local project images
_.each(Assets.Images, function(value, key) {
    Assets.Images[key] = '../../../nuclear-physics/src/img/' + value;
});

// Add our local project images
_.extend(Assets.Images, localImages);

export default Assets;
