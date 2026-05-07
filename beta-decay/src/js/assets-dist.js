import _ from 'underscore';
import Assets from 'nuclear-physics/assets';
import localImages from './assets-images';

Assets.Path = 'img/';

// Add our local project images
_.extend(Assets.Images, localImages);

export default Assets;
