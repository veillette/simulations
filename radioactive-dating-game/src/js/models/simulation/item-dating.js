import NuclearPhysicsSimulation from 'models/simulation';
import DatableItem from 'radioactive-dating-game/models/datable-item';

/**
 * Base simulation model for simulations where items are radiometrically dated
 */
var ItemDatingSimulation = NuclearPhysicsSimulation.extend({

    getDatableAir: function() {
        return DatableItem.DATABLE_AIR;
    }

});

export default ItemDatingSimulation;
