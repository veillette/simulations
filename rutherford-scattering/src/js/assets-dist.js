import _ from 'underscore';
import Assets from 'nuclear-physics/assets';

Assets.Path = 'img/';

// Add our local project images
_.extend(Assets.Images, require('./assets-images'));

export default Assets;
