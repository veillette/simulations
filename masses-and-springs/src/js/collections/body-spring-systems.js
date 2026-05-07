import Backbone from 'backbone';

import BodySpringSystemModel from 'models/body-spring-system';

var BodySpringSystemsCollections = Backbone.Collection.extend({
    model: BodySpringSystemModel
});

export default BodySpringSystemsCollections;
