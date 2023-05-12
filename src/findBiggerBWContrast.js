//////////CHOOSE BLACK OR WHITE FOR FOREGROUND TEXT COLOR\\\\\\\\
export default function findBiggerBWContrast(hexColor) {
    const blackContrast = getContrastRatio(hexColor, '#000000');
    const whiteContrast = getContrastRatio(hexColor, '#FFFFFF');
    if (blackContrast > whiteContrast) {
        return '#000000'
    } else {
        return '#FFFFFF'
    }

    function getContrastRatio(color1, color2) {
        const luminance1 = getRelativeLuminance(color1);
        const luminance2 = getRelativeLuminance(color2);
        const contrastRatio = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
        return contrastRatio;
    }

    function getRelativeLuminance(hexColor) {
        // Convert hexadecimal color to RGB values
        const r = parseInt(hexColor.slice(1, 3), 16) / 255;
        const g = parseInt(hexColor.slice(3, 5), 16) / 255;
        const b = parseInt(hexColor.slice(5, 7), 16) / 255;
        // Apply the relative luminance formula
        const luminance = 0.2126 * getSRGBComponent(r) + 0.7152 * getSRGBComponent(g) + 0.0722 * getSRGBComponent(b);
        return luminance;
    }

    function getSRGBComponent(component) {
        if (component <= 0.03928) {
            return component / 12.92;
        } else {
            return Math.pow((component + 0.055) / 1.055, 2.4);
        }
    }
}