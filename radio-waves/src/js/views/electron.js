import PixiView from 'common/v3/pixi/view';
import Assets from 'assets';

/**
 * A view that represents an electron
 */
var ElectronView = PixiView.extend({

    /**
     * Initializes the new ElectronView.
     */
    initialize: function(options) {
        this.mvt = options.mvt;

        this.initGraphics();

        this.listenTo(this.model, 'change:position', this.updatePosition);
    },

    /**
     * Initializes everything for rendering graphics
     */
    initGraphics: function() {
        var electron = Assets.createSprite(Assets.Images.ELECTRON);
        electron.anchor.x = 0.5;
        electron.anchor.y = 0.5;
        this.displayObject.addChild(electron);

        this.updateMVT(this.mvt);
    },

    /**
     * Updates the model-view-transform and anything that
     *   relies on it.
     */
    updateMVT: function(mvt) {
        this.mvt = mvt;

        this.updatePosition(this.model, this.model.get('position'));
    },

    updatePosition: function(electron, position) {
        var viewPosition = this.mvt.modelToView(position);
        this.displayObject.x = viewPosition.x;
        this.displayObject.y = viewPosition.y;
    }

});


export default ElectronView;
