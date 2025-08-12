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
		},
		generateRandomColorScheme(count),
		generateRandomMonochrome(count),
		generateRandomAnalogous(count),
		generateRandomWarmCool(count)
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

export type RandomSchemeType =
	| 'random'
	| 'monochrome'
	| 'analogous'
	| 'complementary'
	| 'triadic'
	| 'warm'
	| 'cool'
	| 'pastel'
	| 'vibrant'
	| 'earth';

export const generateRandomColorSchemeByType = (
	count: number = 5,
	type: RandomSchemeType = 'random'
): ColorScheme => {
	switch (type) {
		case 'monochrome':
			return generateRandomMonochrome(count);
		case 'analogous':
			return generateRandomAnalogous(count);
		case 'complementary':
			return generateRandomComplementary(count);
		case 'triadic':
			return generateRandomTriadic(count);
		case 'warm':
			return generateRandomWarm(count);
		case 'cool':
			return generateRandomCool(count);
		case 'pastel':
			return generateRandomPastel(count);
		case 'vibrant':
			return generateRandomVibrant(count);
		case 'earth':
			return generateRandomEarth(count);
		default:
			return generateRandomColorScheme(count);
	}
};

export const generateRandomColorScheme = (count: number = 5): ColorScheme => {
	// Generate base colors with good separation
	const baseHue = ranInRange(0, 360);
	const colors: string[] = [];

	if (count === 1) {
		colors.push(chroma.hsl(baseHue, 0.7, 0.5).hex());
	} else if (count === 2) {
		// Complementary colors
		colors.push(chroma.hsl(baseHue, 0.7, 0.5).hex());
		colors.push(chroma.hsl((baseHue + 180) % 360, 0.7, 0.5).hex());
	} else {
		// Distribute colors evenly around the color wheel
		const hueIncrement = 360 / count;

		for (let i = 0; i < count; i++) {
			const hue = (baseHue + i * hueIncrement) % 360;
			const saturation = ranInRange(0.4, 0.9);
			const lightness = ranInRange(0.3, 0.7);
			colors.push(chroma.hsl(hue, saturation, lightness).hex());
		}
	}

	return {
		name: 'Random',
		colors: colors
	};
};

export const generateRandomMonochrome = (count: number = 5): ColorScheme => {
	const baseHue = ranInRange(0, 360);
	const baseSaturation = ranInRange(0.3, 0.8);

	const colors = Array.from({ length: count }, () => {
		const lightness = ranInRange(0.1, 0.9);
		return chroma.hsl(baseHue, baseSaturation, lightness).hex();
	});

	return {
		name: 'Random Monochrome',
		colors: colors
	};
};

export const generateRandomAnalogous = (count: number = 5): ColorScheme => {
	const baseHue = ranInRange(0, 360);
	const hueRange = ranInRange(30, 60); // Analogous colors within 30-60 degrees

	const colors = Array.from({ length: count }, () => {
		const hue = (baseHue + ranInRange(-hueRange / 2, hueRange / 2)) % 360;
		const saturation = ranInRange(0.5, 0.9);
		const lightness = ranInRange(0.3, 0.7);
		return chroma.hsl(hue, saturation, lightness).hex();
	});

	return {
		name: 'Random Analogous',
		colors: colors
	};
};

export const generateRandomWarmCool = (count: number = 5): ColorScheme => {
	const isWarm = ranInRange(0, 1) > 0.5;

	const colors = Array.from({ length: count }, () => {
		let hue: number;
		if (isWarm) {
			// For warm colors, pick from two ranges
			hue = ranInRange(0, 1) > 0.5 ? ranInRange(330, 360) : ranInRange(0, 60);
		} else {
			hue = ranInRange(180, 270);
		}

		const saturation = ranInRange(0.5, 0.9);
		const lightness = ranInRange(0.3, 0.7);
		return chroma.hsl(hue, saturation, lightness).hex();
	});

	return {
		name: isWarm ? 'Random Warm' : 'Random Cool',
		colors: colors
	};
};

export const generateRandomComplementary = (count: number = 5): ColorScheme => {
	const baseHue = ranInRange(0, 360);
	const colors: string[] = [];

	if (count >= 2) {
		colors.push(chroma.hsl(baseHue, 0.7, 0.5).hex());
		colors.push(chroma.hsl((baseHue + 180) % 360, 0.7, 0.5).hex());
	}

	// Fill remaining slots with variations
	for (let i = 2; i < count; i++) {
		const hue = i % 2 === 0 ? baseHue : (baseHue + 180) % 360;
		const saturation = ranInRange(0.4, 0.9);
		const lightness = ranInRange(0.2, 0.8);
		colors.push(chroma.hsl(hue, saturation, lightness).hex());
	}

	return {
		name: 'Random Complementary',
		colors: colors.slice(0, count)
	};
};

export const generateRandomTriadic = (count: number = 5): ColorScheme => {
	const baseHue = ranInRange(0, 360);
	const colors: string[] = [];

	// Generate triadic base colors
	for (let i = 0; i < Math.min(3, count); i++) {
		const hue = (baseHue + i * 120) % 360;
		colors.push(chroma.hsl(hue, 0.7, 0.5).hex());
	}

	// Fill remaining slots with variations
	for (let i = 3; i < count; i++) {
		const baseIndex = i % 3;
		const baseHueVar = (baseHue + baseIndex * 120) % 360;
		const saturation = ranInRange(0.4, 0.9);
		const lightness = ranInRange(0.2, 0.8);
		colors.push(chroma.hsl(baseHueVar, saturation, lightness).hex());
	}

	return {
		name: 'Random Triadic',
		colors: colors.slice(0, count)
	};
};

export const generateRandomWarm = (count: number = 5): ColorScheme => {
	const colors = Array.from({ length: count }, () => {
		// Warm hues: reds, oranges, yellows (0-60, 300-360)
		const hue = ranInRange(0, 1) > 0.5 ? ranInRange(0, 60) : ranInRange(300, 360);
		const saturation = ranInRange(0.5, 0.9);
		const lightness = ranInRange(0.3, 0.7);
		return chroma.hsl(hue, saturation, lightness).hex();
	});

	return {
		name: 'Random Warm',
		colors: colors
	};
};

export const generateRandomCool = (count: number = 5): ColorScheme => {
	const colors = Array.from({ length: count }, () => {
		// Cool hues: blues, greens, purples (120-300)
		const hue = ranInRange(120, 300);
		const saturation = ranInRange(0.5, 0.9);
		const lightness = ranInRange(0.3, 0.7);
		return chroma.hsl(hue, saturation, lightness).hex();
	});

	return {
		name: 'Random Cool',
		colors: colors
	};
};

export const generateRandomPastel = (count: number = 5): ColorScheme => {
	const colors = Array.from({ length: count }, () => {
		const hue = ranInRange(0, 360);
		const saturation = ranInRange(0.2, 0.5); // Low saturation for pastels
		const lightness = ranInRange(0.7, 0.9); // High lightness for pastels
		return chroma.hsl(hue, saturation, lightness).hex();
	});

	return {
		name: 'Random Pastel',
		colors: colors
	};
};

export const generateRandomVibrant = (count: number = 5): ColorScheme => {
	const colors = Array.from({ length: count }, () => {
		const hue = ranInRange(0, 360);
		const saturation = ranInRange(0.8, 1.0); // High saturation for vibrancy
		const lightness = ranInRange(0.4, 0.6); // Medium lightness for vibrancy
		return chroma.hsl(hue, saturation, lightness).hex();
	});

	return {
		name: 'Random Vibrant',
		colors: colors
	};
};

export const generateRandomEarth = (count: number = 5): ColorScheme => {
	const colors = Array.from({ length: count }, () => {
		// Earth tones: browns, greens, oranges (20-60, 80-120)
		const hue = ranInRange(0, 1) > 0.5 ? ranInRange(20, 60) : ranInRange(80, 120);
		const saturation = ranInRange(0.3, 0.7); // Muted saturation
		const lightness = ranInRange(0.2, 0.6); // Darker tones
		return chroma.hsl(hue, saturation, lightness).hex();
	});

	return {
		name: 'Random Earth',
		colors: colors
	};
};

// Convenience function to generate any random color scheme
export const generateAnyRandomColorScheme = (count: number = 5): ColorScheme => {
	const schemeTypes: RandomSchemeType[] = [
		'random',
		'monochrome',
		'analogous',
		'complementary',
		'triadic',
		'warm',
		'cool',
		'pastel',
		'vibrant',
		'earth'
	];

	const randomType = ranChoice(schemeTypes);
	return generateRandomColorSchemeByType(count, randomType);
};
