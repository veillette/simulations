import Colors from './colors';

var WavelengthColors = {

    MIN_WAVELENGTH: 380,
    MAX_WAVELENGTH: 780,

    /**
     * Converts wavelengths (in nanometers) to hex format.  Code duplication
     *   here for the sake of efficiency
     */
    nmToHex: function(wavelength, returnHexInteger) {
        var w = parseInt(wavelength, 10),
            SSS,
            R,
            G,
            B;

        if (w >= 380 && w < 440) {
            R = -(w - 440.0) / (440.0 - 350.0);
            G = 0.0;
            B = 1.0;
        } else if (w >= 440 && w < 490) {
            R = 0.0;
            G = (w - 440.0) / (490.0 - 440.0);
            B = 1.0;
        } else if (w >= 490 && w < 510) {
            R = 0.0;
            G = 1.0;
            B = -(w - 510.0) / (510.0 - 490.0);
        } else if (w >= 510 && w < 580) {
            R = (w - 510.0) / (580.0 - 510.0);
            G = 1.0;
            B = 0.0;
        } else if (w >= 580 && w < 645) {
            R = 1.0;
            G = -(w - 645.0) / (645.0 - 580.0);
            B = 0.0;
        } else if (w >= 645 && w <= 780) {
            R = 1.0;
            G = 0.0;
            B = 0.0;
        } else {
            R = 0.0;
            G = 0.0;
            B = 0.0;
        }

        if (w >= 380 && w < 420) {
            SSS = 0.3 + 0.7 * (w - 350) / (420 - 350);
        } else if (w >= 420 && w <= 700) {
            SSS = 1.0;
        } else if (w > 700 && w <= 780) {
            SSS = 0.3 + 0.7 * (780 - w) / (780 - 700);
        } else {
            SSS = 0.0;
        }

        SSS *= 255;

        if (returnHexInteger) {
            return Colors.rgbToHexInteger(
                parseInt(SSS * R, 10), 
                parseInt(SSS * G, 10), 
                parseInt(SSS * B, 10)
            );
        }
        else {
            return Colors.rgbToHex(
                parseInt(SSS * R, 10), 
                parseInt(SSS * G, 10), 
                parseInt(SSS * B, 10)
            );  
        }
    },

    /**
     * Converts wavelengths (in nanometers) to rgba format.  Code duplication
     *   here for the sake of efficiency
     */
    nmToRgba: function(wavelength, alpha, returnObject) {
        var w = parseInt(wavelength, 10),
            SSS,
            R,
            G,
            B;

        if (w >= 380 && w < 440) {
            R = -(w - 440.0) / (440.0 - 350.0);
            G = 0.0;
            B = 1.0;
        } else if (w >= 440 && w < 490) {
            R = 0.0;
            G = (w - 440.0) / (490.0 - 440.0);
            B = 1.0;
        } else if (w >= 490 && w < 510) {
            R = 0.0;
            G = 1.0;
            B = -(w - 510.0) / (510.0 - 490.0);
        } else if (w >= 510 && w < 580) {
            R = (w - 510.0) / (580.0 - 510.0);
            G = 1.0;
            B = 0.0;
        } else if (w >= 580 && w < 645) {
            R = 1.0;
            G = -(w - 645.0) / (645.0 - 580.0);
            B = 0.0;
        } else if (w >= 645 && w <= 780) {
            R = 1.0;
            G = 0.0;
            B = 0.0;
        } else {
            R = 0.0;
            G = 0.0;
            B = 0.0;
        }

        if (w >= 380 && w < 420) {
            SSS = 0.3 + 0.7 * (w - 350) / (420 - 350);
        } else if (w >= 420 && w <= 700) {
            SSS = 1.0;
        } else if (w > 700 && w <= 780) {
            SSS = 0.3 + 0.7 * (780 - w) / (780 - 700);
        } else {
            SSS = 0.0;
        }

        SSS *= 255;

        if (alpha === undefined)
            alpha = 1;

        if (returnObject) {
            return {
                r: parseInt(SSS * R, 10), 
                g: parseInt(SSS * G, 10), 
                b: parseInt(SSS * B, 10),
                a: alpha
            };
        }
        else {
            return 'rgba(' + parseInt(SSS * R, 10) + ',' + parseInt(SSS * G, 10) + ',' + parseInt(SSS * B, 10) + ',' + alpha + ')';
        }
    }

};

export default WavelengthColors;
