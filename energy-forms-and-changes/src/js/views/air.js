import PixiView from 'common/v3/pixi/view';
import EnergyChunkCollectionView from 'views/energy-chunk-collection';

/**
 * A view that represents the air model
 */
var AirView = PixiView.extend({

    /**
     *
     */
    initialize: function(options) {
        if (options.mvt === undefined)
            throw 'AirView requires a ModelViewTransform object specified in the options as "mvt".';

        this.mvt = options.mvt;

        this.energyChunkCollectionView = new EnergyChunkCollectionView({
            collection: this.model.energyChunkList,
            mvt: this.mvt
        });

        this.displayObject.addChild(this.energyChunkCollectionView.displayObject);

        this.hideEnergyChunks();
    },

    update: function(time, deltaTime) {
        this.energyChunkCollectionView.update(time, deltaTime);
    },

    showEnergyChunks: function() {
        this.displayObject.visible = true;
    },

    hideEnergyChunks: function() {
        this.displayObject.visible = false;
    }

});

export default AirView;