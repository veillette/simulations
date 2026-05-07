import _ from 'underscore';
import Assets from 'rutherford-scattering/assets';

Assets.Path = 'img/';

// Add our local project images
_.extend(Assets.Images, require('./assets-images'));

export default Assets;
