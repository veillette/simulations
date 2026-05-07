import _ from 'underscore';
import Simulation from 'common/simulation/simulation';
import Springs from 'collections/springs';
import Bodies from 'collections/bodies';
import Systems from 'collections/body-spring-systems';
import Constants from 'constants';
import Initials from 'initials';


/**
 * Wraps the update function in
 */
var MassesAndSpringsSimulation = Simulation.extend({

    defaults: _.extend(Simulation.prototype.defaults, {
        gravity : Constants.SimSettings.GRAVITY_DEFAULT,
        friction : Constants.SimSettings.FRICTION_DEFAULT,
        units : {
            time : 'sec'
        }
    }),

    initialize: function(attributes, options) {
        Simulation.prototype.initialize.apply(this, [attributes, options]);

        this.on('change:gravity', this.updateGravity);
        this.on('change:friction', this.updateFriction);

        this.initComponents();
    },

    /**
     * Initializes the models used in the simulation
     */
    initComponents: function() {

        this.initSprings();
        this.initBodies();

        this.initSystems();

    },

    resetComponents: function() {
        this.springs.reset(Initials.Springs);
        this.bodies.reset(Initials.Bodies);
        this.systems.reset(this.getSystemsModels());
    },

    initSprings: function(){
        this.springs = new Springs(Initials.Springs);
    },

    initBodies: function(){
        this.bodies = new Bodies(Initials.Bodies);
    },

    initSystems: function(){
        var springs = this.getSystemsModels();

        this.systems = new Systems(springs);
    },

    getSystemsModels: function() {
        return this.springs.map(function(spring){
            return {
                spring: spring,
                // TODO should update and read from UI input.  temporary defaults
                gravity : this.get('gravity'),
                b: this.get('friction')
            };
        }, this);
    },

    updateGravity: function(model, gravity){
        this.systems.each(function(system){
            system.set('gravity', gravity);
        });
        this.bodies.each(function(body){
            body.set('acceleration', gravity);
        });
    },

    updateFriction: function(model, friction){
        this.systems.each(function(system){
            system.set('b', friction);
        });
    },

    _update: function(time, deltaTime) {
        this.systems.each(function(system){
            system.evolve(deltaTime);
        });

        // would like to make it so that models that need to evolve are being checked
        // on update
        this.bodies.chain().where({resting: false}).each(function(body){
            body.evolve(deltaTime);
        });
    }

});

export default MassesAndSpringsSimulation;
