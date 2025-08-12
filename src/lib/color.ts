import chroma, { random } from 'chroma-js';

export interface ColorScheme {
    name: string;
    colors: string[];
}

export const allBrewerSchemes = (count: number = 5) => {
    const allColors = []
    for (const key in chroma.brewer) {
        allColors.push(chroma.scale(key).colors(count));
    }
    return allColors
}

export const randomBrewerScheme = (count: number = 5) => {
    const keys = Object.keys(chroma.brewer);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return { name: "brewer", colors: chroma.scale(key).colors(count) }
}

export const randomColorScheme = (count: number = 5): ColorScheme => {
    const optionsDict =
        [
            {
                name: "Brewer",
                colors: randomBrewerScheme(count).colors
            },
            {
                name: "Monochromatic",
                colors: createMonochromaticScale(count)
            },
            {
                name: "Analogous",
                colors: generateAnalogous(chroma.random().hex(), count)
            },
            {
                name: "Complementary",
                colors: generateComplementary(chroma.random().hex())
            },
            {
                name: "Split Complementary",
                colors: generateSplitComplementary(chroma.random().hex())
            },
            {
                name: "Triadic",
                colors: generateTriadic(chroma.random().hex())
            },
            {
                name: "Tetradic",
                colors: generateTetradic(chroma.random().hex())
            },
            {
                name: "Square",
                colors: generateSquare(chroma.random().hex())
            },
            {
                name: "Neutral",
                colors: generateNeutral(chroma.random().hex())
            },
            {
                name: "Warm",
                colors: generateWarm(chroma.random().hex())
            },
            {
                name: "Cool",
                colors: generateCool(chroma.random().hex())
            }
        ]
    return optionsDict[Math.floor(Math.random() * optionsDict.length)]
}

export const createMonochromaticScale = (steps: number = 5, baseColor: string = chroma.random().hex()) => {
    // Generate the scale from dark to light using chroma's scale and .darken()/lighten()
    validateColor(baseColor);
    return chroma
        .scale([chroma(baseColor).darken(3), baseColor, chroma(baseColor).brighten(2)])
        .mode('lab') // Use LAB color space for perceptually smooth transitions
        .colors(steps); // Generate the desired number of steps
}

function generateAnalogous(baseColor: string, count = 5) {
    validateColor(baseColor);
    const hue = chroma(baseColor).get('hsl.h');
    const increment = 30; // Degrees between analogous hues
    return Array.from({ length: count }, (_, i) =>
        chroma.hsl((hue + i * increment) % 360, 0.7, 0.5).hex()
    );
}

function validateColor(baseColor: string) {
    if (!chroma.valid(baseColor)) {
        throw new Error(`Invalid color input: ${baseColor}`);
    }
}

function generateComplementary(baseColor: string) {
    validateColor(baseColor);
    const hue = chroma(baseColor).get('hsl.h');
    const complementaryHue = (hue + 180) % 360;
    return [baseColor, chroma.hsl(complementaryHue, 0.7, 0.5).hex()];
}

function generateSplitComplementary(baseColor: string) {
    validateColor(baseColor);
    const hue = chroma(baseColor).get('hsl.h');
    return [
        baseColor,
        chroma.hsl((hue + 150) % 360, 0.7, 0.5).hex(),
        chroma.hsl((hue + 210) % 360, 0.7, 0.5).hex(),
    ];
}

function generateTriadic(baseColor: string) {
    validateColor(baseColor);
    const hue = chroma(baseColor).get('hsl.h');
    return [
        baseColor,
        chroma.hsl((hue + 120) % 360, 0.7, 0.5).hex(),
        chroma.hsl((hue + 240) % 360, 0.7, 0.5).hex(),
    ];
}

function generateTetradic(baseColor: string) {
    validateColor(baseColor);
    const hue = chroma(baseColor).get('hsl.h');
    return [
        baseColor,
        chroma.hsl((hue + 90) % 360, 0.7, 0.5).hex(),
        chroma.hsl((hue + 180) % 360, 0.7, 0.5).hex(),
        chroma.hsl((hue + 270) % 360, 0.7, 0.5).hex(),
    ];
}

function generateSquare(baseColor: string) {
    validateColor(baseColor);
    const hue = chroma(baseColor).get('hsl.h');
    return [
        baseColor,
        chroma.hsl((hue + 90) % 360, 0.7, 0.5).hex(),
        chroma.hsl((hue + 180) % 360, 0.7, 0.5).hex(),
        chroma.hsl((hue + 270) % 360, 0.7, 0.5).hex(),
    ];
}

function generateNeutral(baseColor = '#000000', count = 5) {
    return chroma.scale([baseColor, '#ffffff']).mode('lab').colors(count);
}


function generateWarm(baseColor: string, count = 5) {
    validateColor(baseColor);
    return chroma.scale(['red', baseColor]).mode('lab').colors(count);
}

function generateCool(baseColor: string, count = 5) {
    validateColor(baseColor);
    return chroma.scale(['blue', baseColor]).mode('lab').colors(count);
}

export const generateGreenScheme = (count: number = 5): ColorScheme => {
    // Base green color
    const baseGreen = "#00FF00"; // Pure green in hex
    return {
        name: "Green",
        colors: Array.from({ length: count }, () => {
            const randomSaturation = Math.random() * 0.5 + 0.5; // Saturation between 50% and 100%
            const randomLightness = Math.random() * 0.5 + 0.3; // Lightness between 30% and 80%
            return chroma.hsl(120, randomSaturation, randomLightness).hex(); // HSL for green
        }),
    }
};
