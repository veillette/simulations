import Backbone from 'backbone';

import SpringModel from 'models/spring';

var SpringsCollection = Backbone.Collection.extend({
    model: SpringModel
});

export default SpringsCollection;
