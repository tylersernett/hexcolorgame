////////create an array of objects: {hexString, correct bool, touched bool}
export default function generateHexes(num) {
    const hexes = [];
    const hexStrings = generateColors(num);
    for (let n = 0; n < num; n++) {
        let hexObj = {
            hexString: hexStrings[n],
            correct: n === 0 ? true : false, //0th is always correct answer before it's shuffled
            touched: false,
        };
        hexes.push(hexObj);
    }
    return hexes

    //ensure the colors selected are spread throughout the color wheel (in terms of H, S, & V)
    function generateColors(numColors) {
        const interval = 360 / numColors;
        let hue = Math.random() * 360;
        const colors = [];
        const startingSat = Math.random();
        const startingVal = Math.random();
        for (let i = 0; i < numColors; i++) {
            hue = (hue + interval) % 360;
            let sat = (startingSat + (i / numColors)) % 1;
            let val = (startingVal + (i / numColors)) % 1;
            const rgb = hsvToRgb(hue / 360, sat, val);
            const hexColor = rgbToHex(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
            colors.push(hexColor);
        }
        return colors;
    }

    //https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
    function hsvToRgb(h, s, v) {
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v; g = t; b = p; break;
            case 1:
                r = q; g = v; b = p; break;
            case 2:
                r = p; g = v; b = t; break;
            case 3:
                r = p; g = q; b = v; break;
            case 4:
                r = t; g = p; b = v; break;
            case 5:
                r = v; g = p; b = q; break;
            default:
        }
        return [r, g, b];
    }

    function rgbToHex(r, g, b) {
        return componentToHex(Math.round(r)) + componentToHex(Math.round(g)) + componentToHex(Math.round(b));
    }

    function componentToHex(c) {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
}
