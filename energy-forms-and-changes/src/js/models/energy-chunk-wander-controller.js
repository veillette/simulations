define(function (require) {

    'use strict';

    var _         = require('underscore');
    var Backbone  = require('backbone');
    var Rectangle = require('rectangle-node');

    /**
     * Constants
     */
    var Constants = require('models/constants');

    /**
     * 
     */
    var EnergyChunkWanderController = function(energyChunk, destination, initialWanderConstraint) {
        this.energyChunk = energyChunk;
        this.destination = new Vector2(destination);
        this.velocity    = new Vector2(0, EnergyChunkWanderController.MAX_VELOCITY);
        this.initialWanderConstraint = new Rectangle();
        this.countdownTimer = 0;

        if (initialWanderConstraint)
            this.initialWanderConstraint.set(initialWanderConstraint);

        this.resetCountdownTimer();
        this.changeVelocityVector();
    };
    var C = EnergyChunkWanderController;

    /**
     * Apply static constants
     */
    _.extend(EnergyChunkWanderController, Constants.EnergyChunkWanderController);

    /**
     * Functions
     */
    _.extend(EnergyChunkWanderController.prototype, {

        updatePosition: function(deltaTime) {
            var distanceToDestination = this.energyChunk.position.distance(this.destination);
            if (distanceToDestination < this.velocity.length() * deltaTime && !this.energyChunk.position.equals(this.destination)) {
                 // Destination reached.
                this.energyChunk.position.set(destination);
                this.velocity.scale(0);
            }
            else if (this.energyChunk.position.distance(this.destination) < deltaTime * this.velocity.length()) {
                // Prevent overshoot.
                this.velocity.scale(this.energyChunk.position.distance(this.destination) * deltaTime);
            }

            // Stay within the horizontal confines of the initial bounds.
            if (this.initialWanderConstraint && this.energyChunk.position.y < this.initialWanderConstraint.top()) {
                var proposedPosition = this.energyChunk.position.add(this.velocity.scale(deltaTime));
                if (proposedPosition.x < this.initialWanderConstraint.left() || proposedPosition.x > this.initialWanderConstraint.right()) {
                    // Bounce in the x direction to prevent going outside initial bounds.
                    this.velocity.set(-this.velocity.x, this.velocity.y);
                }
            }

            this.energyChunk.position.set(this.energyChunk.position.add(this.velocity.scale(deltaTime)));
            this.countdownTimer -= deltaTime;
            if (this.countdownTimer <= 0) {
                this.changeVelocityVector();
                this.resetCountdownTimer();
            }
        },

        changeVelocityVector: function() {
            var vectorToDestination = this.destination.sub(this.energyChunk.position);
            var angle = vectorToDestination.angle();
            if (vectorToDestination.length() > C.DISTANCE_AT_WHICH_TO_STOP_WANDERING) {
                // Add some randomness to the direction of travel.
                angle = angle + (Math.random() - 0.5) * 2 * C.MAX_ANGLE_VARIATION;
            }
            var scalarVelocity = C.MIN_VELOCITY 
                               + (C.MAX_VELOCITY - C.MIN_VELOCITY) 
                               * Math.random();
            this.velocity.set(scalarVelocity * Math.cos(angle), scalarVelocity * Math.sin(angle));
        },

        resetCountdownTimer: function() {
            this.countdownTimer = C.MIN_TIME_IN_ONE_DIRECTION + (C.MAX_TIME_IN_ONE_DIRECTION - C.MIN_TIME_IN_ONE_DIRECTION) * Math.random();
        },

        desinationReached: function() {
            return this.destination.distance(this.energyChunk.position) < 1E-7;
        }

    });

    return EnergyChunkWanderController;
});
