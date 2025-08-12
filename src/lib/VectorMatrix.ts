export interface Vector {
	x: number;
	y: number;
}

export class VectorMatrices {
	path!: string;
	vectors: VectorMatrix[];

	constructor(vectors: VectorMatrix[]) {
		this.vectors = vectors;
	}
	addVectorMatrix(v: VectorMatrix) {
		this.vectors.push(v);
		this.updatePath();
		return this;
	}
	rotate(deg: number) {
		//TODO Fix: rotate entire structure
		this.vectors = this.vectors.map((v) => v.rotate(deg));
		this.updatePath();
		return this;
	}

	offset(x: number, y: number) {
		this.vectors = this.vectors.map((v) => v.offset(x, y));
		this.updatePath();
		return this;
	}

	scaleToRadius(maxRadius: number) {
		this.vectors = this.vectors.map((v) => v.scaleToRadius(maxRadius));
		this.updatePath();
		return this;
	}
	updatePath() {
		//console.log("no update")

		let acc = 0;
		this.vectors.map((v) => (acc += v.vectors.length));
		console.log(acc);
	}

	[Symbol.iterator](): Iterator<VectorMatrix> {
		return this.vectors[Symbol.iterator]();
	}
}

export class VectorMatrix {
	path!: string;
	vectors: Vector[];

	constructor(vectors: Vector[] = []) {
		this.vectors = vectors;
		this.updatePath();
	}

	getPath() {
		return (
			this.vectors
				.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(3)} ${p.y.toFixed(3)}`)
				.join(' ') + ' Z'
		);
	}

	updatePath() {
		this.path =
			this.vectors
				.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(3)} ${p.y.toFixed(3)}`)
				.join(' ') + ' Z';
	}

	rotate(deg: number) {
		if (this.vectors.length === 0) return this;
		const degrees = deg;
		const rad = (degrees * Math.PI) / 180;
		this.vectors.forEach((vector, index) => {
			const { x, y } = vector;
			this.vectors[index] = {
				x: x * Math.cos(rad) - y * Math.sin(rad),
				y: x * Math.sin(rad) + y * Math.cos(rad)
			};
		});

		this.updatePath();
		return this;
	}

	offset(x: number, y: number) {
		if (this.vectors.length === 0) return this;
		this.vectors.forEach((vector, index) => {
			const { x: px, y: py } = vector;
			this.vectors[index] = {
				x: px + x,
				y: py + y
			};
		});
		this.updatePath();
		return this;
	}

	scaleToRadius(maxRadius: number) {
		if (this.vectors.length === 0) return this;
		// Step 1: Calculate the current maximum distance
		const maxDistance = Math.max(...this.vectors.map(({ x, y }) => Math.hypot(x, y)));

		// Step 2: Determine the scaling factor
		if (maxDistance === 0) return this;
		const scaleFactor = maxRadius / maxDistance;
		//if (maxRadius > maxDistance) return; enable to ensure that the shape is always scaled to the maxRadius

		// Step 3: Scale all vectors
		this.vectors.forEach((vector, index) => {
			const { x: px, y: py } = vector;
			this.vectors[index] = {
				x: px * scaleFactor,
				y: py * scaleFactor
			};
		});
		this.updatePath();
		return this;
	}

	createCircularPattern(repetitions: number, radius: number): VectorMatrices {
		const fullCircle = 2 * Math.PI; // 360 degrees in radians
		const angleIncrement = fullCircle / repetitions; // Angle between each placement

		const result: VectorMatrix[] = []; // Array to store groups of vectors

		for (let i = 0; i < repetitions; i++) {
			// Calculate the angle for the current repetition
			const angle = i * angleIncrement;

			// Calculate the center point for this repetition
			const centerX = radius * Math.cos(angle);
			const centerY = radius * Math.sin(angle);

			// Create the rotated and translated group
			const group: Vector[] = this.vectors.map(({ x, y }) =>
				this.applyRotationAndTranslation(x, y, angle, centerX, centerY)
			);

			// Add the transformed group to the result
			result.push(new VectorMatrix(group));
		}
		return new VectorMatrices(result);
	}

	private applyRotationAndTranslation(
		x: number,
		y: number,
		angle: number,
		centerX: number,
		centerY: number
	): Vector {
		const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
		const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
		return { x: rotatedX + centerX, y: rotatedY + centerY };
	}
}
