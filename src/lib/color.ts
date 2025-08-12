import chroma from 'chroma-js';
import { ranChoice, ranInRange } from './Functions';

export interface ColorScheme {
	name: string;
	colors: string[];
}

export const allBrewerSchemes = (count: number = 5) => {
	const allColors = [];
	for (const key in chroma.brewer) {
		allColors.push(chroma.scale(chroma.brewer[key as keyof typeof chroma.brewer]).colors(count));
	}
	return allColors;
};

export const randomBrewerScheme = (count: number = 5) => {
	const keys = Object.keys(chroma.brewer);
	const key = ranChoice(keys) as keyof typeof chroma.brewer;
	return { name: 'brewer', colors: chroma.scale(chroma.brewer[key]).colors(count) };
};

function generateRandomColor(): string {
	const hue = ranInRange(0, 360);
	const saturation = ranInRange(0.5, 1);
	const lightness = ranInRange(0.3, 0.7);
	return chroma.hsl(hue, saturation, lightness).hex();
}

export const randomColorScheme = (count: number = 5): ColorScheme => {
	const optionsDict = [
		{
			name: 'Brewer',
			colors: randomBrewerScheme(count).colors
		},
		{
			name: 'Monochromatic',
			colors: createMonochromaticScale(count)
		},
		{
			name: 'Analogous',
			colors: generateAnalogous(generateRandomColor(), count)
		},
		{
			name: 'Complementary',
			colors: generateComplementary(generateRandomColor())
		},
		{
			name: 'Split Complementary',
			colors: generateSplitComplementary(generateRandomColor())
		},
		{
			name: 'Triadic',
			colors: generateTriadic(generateRandomColor())
		},
		{
			name: 'Tetradic',
			colors: generateTetradic(generateRandomColor())
		},
		{
			name: 'Square',
			colors: generateSquare(generateRandomColor())
		},
		{
			name: 'Neutral',
			colors: generateNeutral(generateRandomColor())
		},
		{
			name: 'Warm',
			colors: generateWarm(generateRandomColor())
		},
		{
			name: 'Cool',
			colors: generateCool(generateRandomColor())
		}
	];
	return ranChoice(optionsDict);
};

export const createMonochromaticScale = (
	steps: number = 5,
	baseColor: string = generateRandomColor()
) => {
	// Generate the scale from dark to light using chroma's scale and .darken()/lighten()
	validateColor(baseColor);
	return chroma
		.scale([chroma(baseColor).darken(3), baseColor, chroma(baseColor).brighten(2)])
		.mode('lab') // Use LAB color space for perceptually smooth transitions
		.colors(steps); // Generate the desired number of steps
};

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
		chroma.hsl((hue + 210) % 360, 0.7, 0.5).hex()
	];
}

function generateTriadic(baseColor: string) {
	validateColor(baseColor);
	const hue = chroma(baseColor).get('hsl.h');
	return [
		baseColor,
		chroma.hsl((hue + 120) % 360, 0.7, 0.5).hex(),
		chroma.hsl((hue + 240) % 360, 0.7, 0.5).hex()
	];
}

function generateTetradic(baseColor: string) {
	validateColor(baseColor);
	const hue = chroma(baseColor).get('hsl.h');
	return [
		baseColor,
		chroma.hsl((hue + 90) % 360, 0.7, 0.5).hex(),
		chroma.hsl((hue + 180) % 360, 0.7, 0.5).hex(),
		chroma.hsl((hue + 270) % 360, 0.7, 0.5).hex()
	];
}

function generateSquare(baseColor: string) {
	validateColor(baseColor);
	const hue = chroma(baseColor).get('hsl.h');
	return [
		baseColor,
		chroma.hsl((hue + 90) % 360, 0.7, 0.5).hex(),
		chroma.hsl((hue + 180) % 360, 0.7, 0.5).hex(),
		chroma.hsl((hue + 270) % 360, 0.7, 0.5).hex()
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
	return {
		name: 'Green',
		colors: Array.from({ length: count }, () => {
			const randomSaturation = ranInRange(0.5, 1); // Saturation between 50% and 100%
			const randomLightness = ranInRange(0.3, 0.8); // Lightness between 30% and 80%
			return chroma.hsl(120, randomSaturation, randomLightness).hex(); // HSL for green
		})
	};
};
