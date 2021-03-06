define(function (require) {

    'use strict';

    //var _        = require('underscore');
    var Backbone = require('backbone');
    var Vector2  = require('common/math/vector2');

    var EnergyChunk                 = require('models/energy-chunk');
    var EnergyChunkCollection       = require('models/energy-chunk-collection');
    var EnergyChunkWanderController = require('models/energy-chunk-wander-controller');

    /**
     * Constants
     */
    var Constants = require('constants');
    var EnergyContainerCategory = Constants.EnergyContainerCategory;
    var HeatTransfer = Constants.HeatTransfer;

    /**
     * 
     */
    var Air = Backbone.Model.extend({

        defaults: {
            energy: Constants.Air.INITIAL_ENERGY,
            energyContainerCategory: EnergyContainerCategory.AIR
        },
        
        initialize: function(attributes, options) {
            this.energyChunkList = new EnergyChunkCollection();
            this.energyChunkWanderControllers = [];

            this._centerPoint = new Vector2();
        },

        update: function(time, deltaTime) {
            // Update the position of any energy chunks.
            var controller;
            for (var i = this.energyChunkWanderControllers.length - 1; i >= 0; i--) {
                controller = this.energyChunkWanderControllers[i];
                controller.updatePosition(deltaTime);
                if (!this.getThermalContactArea().getBounds().contains(controller.energyChunk.get('position'))) {
                    this.removeEnergyChunk(controller.energyChunk);
                    this.energyChunkWanderControllers.splice(i, 1);
                    controller.energyChunk.destroy();
                }
            }

            this.equalizeWithSurroundingAir(deltaTime);
        },

        equalizeWithSurroundingAir: function(deltaTime) {
            if (Math.abs(this.getTemperature() - Constants.ROOM_TEMPERATURE) > Constants.SIGNIFICANT_TEMPERATURE_DIFFERENCE) {
                var numFullTimeStepExchanges = Math.floor(deltaTime / Constants.MAX_HEAT_EXCHANGE_TIME_STEP);
                var leftoverTime = deltaTime - (numFullTimeStepExchanges * Constants.MAX_HEAT_EXCHANGE_TIME_STEP);

                var timeStep;
                var thermalEnergyLost;
                var tempDifference;

                for (var i = 0; i < numFullTimeStepExchanges + 1; i++) {
                    timeStep = i < numFullTimeStepExchanges ? Constants.MAX_HEAT_EXCHANGE_TIME_STEP : leftoverTime;
                    tempDifference = (this.getTemperature() - Constants.ROOM_TEMPERATURE);
                    thermalEnergyLost = tempDifference * Constants.HeatTransfer.AIR_TO_SURROUNDING_AIR_HEAT_TRANSFER_FACTOR * timeStep;
                    this.changeEnergy(-thermalEnergyLost);
                }
            }
        },

        changeEnergy: function(deltaEnergy) {
            this.set('energy', this.get('energy') + deltaEnergy);
        },

        reset: function() {
            this.set('energy', Air.INITIAL_ENERGY);
            this.energyChunkList.reset();
            this.energyChunkWanderControllers = [];
        },

        exchangeEnergyWith: function(energyContainer, deltaTime) {
            var thermalContactLength = this.getThermalContactArea().getThermalContactLength(energyContainer.getThermalContactArea());
            if (thermalContactLength > 0) {
                var excessEnergy = energyContainer.getEnergyBeyondMaxTemperature();
                if (excessEnergy === 0 ) {
                    // Container is below max temperature, exchange energy normally.
                    var heatTransferConstant = HeatTransfer.getHeatTransferFactor(this.get('energyContainerCategory'), energyContainer.get('energyContainerCategory'));

                    var numFullTimeStepExchanges = Math.floor(deltaTime / Constants.MAX_HEAT_EXCHANGE_TIME_STEP);
                    var leftoverTime = deltaTime - (numFullTimeStepExchanges * Constants.MAX_HEAT_EXCHANGE_TIME_STEP);

                    for (var i = 0; i < numFullTimeStepExchanges + 1; i++) {
                        var timeStep = i < numFullTimeStepExchanges ? Constants.MAX_HEAT_EXCHANGE_TIME_STEP : leftoverTime;
                        var thermalEnergyGained = (energyContainer.getTemperature() - this.getTemperature()) * thermalContactLength * heatTransferConstant * timeStep;
                        energyContainer.changeEnergy(-thermalEnergyGained);
                        this.changeEnergy(thermalEnergyGained);
                    }
                }
                else {
                    // Item is at max temperature.  Shed all excess energy into the air.
                    energyContainer.changeEnergy(-excessEnergy);
                    this.changeEnergy(excessEnergy);
                }
            }
        },

        addEnergyChunk: function(chunk, initialWanderConstraint) {
            chunk.zPosition = 0;
            this.energyChunkList.add(chunk);
            this.energyChunkWanderControllers.push(new EnergyChunkWanderController(
                chunk,
                new Vector2(chunk.get('position').x, Air.HEIGHT + 0.05),
                initialWanderConstraint
            ));
        },

        removeEnergyChunk: function(chunk) {
            this.energyChunkList.remove(chunk);
        },

        requestEnergyChunk: function(point) {
            // Create a new chunk at the top of the air above the specified point.
            return EnergyChunk.create({
                energyType: EnergyChunk.THERMAL, 
                position:   new Vector2(point.x, Air.HEIGHT)
            });
        },

        getCenterPoint: function() {
            return this._centerPoint.set(
                0,
                Air.HEIGHT
            );
        },

        getThermalContactArea: function() {
            return Air.THERMAL_CONTACT_AREA;
        },

        getTemperature: function() {
            return this.get('energy') / (Air.MASS * Air.SPECIFIC_HEAT);
        },

        getTemperatureAtLocation: function(location) {
            return this.getTemperature();
        },

        getEnergyBeyondMaxTemperature: function() {
            // Air temperature is unlimited.
            return 0;
        }

    }, Constants.Air);

    return Air;
});
