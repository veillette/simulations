import BilliardBallModel from 'hydrogen-atom/models/atomic-model/billiard-ball';
import BohrModel from 'hydrogen-atom/models/atomic-model/bohr';
import DeBroglieModel from 'hydrogen-atom/models/atomic-model/debroglie';
import PlumPuddingModel from 'hydrogen-atom/models/atomic-model/plum-pudding';
import SchroedingerModel from 'hydrogen-atom/models/atomic-model/schroedinger';
import SolarSystemModel from 'hydrogen-atom/models/atomic-model/solar-system';
import Assets from 'assets';

var AtomicModels = {
    BILLIARD_BALL: {
        label: 'Billiard Ball',
        icon: Assets.Images.ICON_BILLIARD_BALL,
        constructor: BilliardBallModel
    },
    PLUM_PUDDING: {
        label: 'Plum Pudding',
        icon: Assets.Images.ICON_PLUM_PUDDING,
        constructor: PlumPuddingModel
    },
    SOLAR_SYSTEM: {
        label: 'Classical Solar System',
        icon: Assets.Images.ICON_SOLAR_SYSTEM,
        constructor: SolarSystemModel
    },
    BOHR: {
        label: 'Bohr',
        icon: Assets.Images.ICON_BOHR,
        constructor: BohrModel
    },
    DEBROGLIE: {
        label: 'deBroglie',
        icon: Assets.Images.ICON_DEBROGLIE,
        constructor: DeBroglieModel
    },
    SCHROEDINGER: {
        label: 'Schrödinger',
        icon: Assets.Images.ICON_SCHROEDINGER,
        constructor: SchroedingerModel
    }
};

export default AtomicModels;
