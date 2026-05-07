import Backbone from 'backbone';

/**
 *
 */
var PhotonAbsorber = Backbone.Model.extend({

    update: function(deltaTime) {},

    absorbPhoton: function(photon) {
        this.trigger('photon-absorbed', photon);
    }

});

export default PhotonAbsorber;
