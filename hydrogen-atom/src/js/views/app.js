import _ from 'underscore';
import PixiAppView from 'common/v3/pixi/view/app';
import HydrogenAtomSimView from 'hydrogen-atom/views/sim';
import BohrModel from 'hydrogen-atom/models/atomic-model/bohr';
import Assets from 'assets';
import 'hydrogen-atom/styles/font-awesome.less';
import 'hydrogen-atom/styles/app.less';
import transitionsDialogHtml from 'hydrogen-atom/templates/transitions-dialog.html?raw';

var HydrogenAtomAppView = PixiAppView.extend({

    assets: Assets.getAssetList(),

    simViewConstructors: [
        HydrogenAtomSimView
    ],

    transitionsDialogTemplate: _.template(transitionsDialogHtml),

    render: function() {
        PixiAppView.prototype.render.apply(this);

        var groundState = BohrModel.getGroundState();
        var numberOfStates = BohrModel.getNumberOfStates();
        var maxState = groundState + numberOfStates - 1;

        this.$el.append(this.transitionsDialogTemplate({
            groundState: groundState,
            maxState: maxState,
            BohrModel: BohrModel
        }));
    }

});

export default HydrogenAtomAppView;
