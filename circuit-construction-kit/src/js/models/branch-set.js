define(function (require) {

    'use strict';

    var _ = require('underscore');

    var Vector2 = require('common/math/vector2');

    var Constants = require('constants');

    var BranchSet = {

        circuit: undefined,
        branches: [],
        junctions: [],

        clear: function() {
            this.circuit = undefined;
            var i = 0;
            for (i = this.branches.length - 1; i >= 0; i--)
                this.branches.slice(i, 1);
            for (i = this.junctions.length - 1; i >= 0; i--)
                this.junctions.slice(i, 1);
            return this;
        },

        setCircuit: function(circuit) {
            this.circuit = circuit;
            return this;
        },

        addBranch: function(branch) {
            if (this.branches.indexOf(branch) === -1)
                this.branches.push(branch);
            return this;
        },

        addBranches: function(branches) {
            for (var i = 0; i < branches.length; i++)
                this.addBranch(branches[i]);
            return this;
        },

        addJunction: function(junction) {
            if (this.junctions.indexOf(junction) === -1)
                this.junctions.push(junction);
            return this;
        },

        addJunctions: function(junctions) {
            for (var i = 0; i < junctions.length; i++)
                this.addBranch(junctions[i]);
            return this;
        },

        translate: function(x, y) {
            if (x instanceof Vector2) {
                y = x.y;
                x = x.x;
            }

            var i;

            var junctionSet = junctions.slice();
            for (i = 0; i < branches.size(); i++) {
                var branch = branches[i];

                if (junctionSet.indexOf(branch.get('startJunction')) === -1)
                    junctionSet.push(branch.get('startJunction'));
                
                if (junctionSet.indexOf(branch.get('endJunction')) === -1)
                    junctionSet.push(branch.get('endJunction'));
            }

            for (i = 0; i < junctionSet.length; i++) {
                // Can't do one-at-a-time, because intermediate notifications get inconsistent data.
                junctionSet[i].translateSilent(x, y);
            }

            for (i = 0; i < junctionSet.length; i++)
                junctionSet[i].trigger('change:position', junctionSet[i], junctionSet[i].get('position'));
            
            return this;
        }

    };

    return BranchSet;
});