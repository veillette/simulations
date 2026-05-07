import Backbone from 'backbone';

import BodyModel from 'models/body';

var BodiesCollection = Backbone.Collection.extend({
    model: BodyModel
});

export default BodiesCollection;
