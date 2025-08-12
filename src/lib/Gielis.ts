import { ranEven, ranInRange } from "./Functions";
import { VectorMatrix, VectorMatrices } from "./VectorMatrix";
import type { Vector } from "./VectorMatrix";

export interface GielisVariables {
    a: number;
    m: number;
    b: number;
    n1: number;
    n2: number;
    n3: number;
    steps: number;
}

export class Gielis {
    variables!: GielisVariables;
    vectorMatrix!: VectorMatrix;


    constructor(
        variables: Partial<GielisVariables> = {}) {
        const defaultValues: GielisVariables = {
            m: 2,
            a: 1.5,
            b: 2,
            n1: 1,
            n2: 3,
            n3: 1.4,
            steps: 50
        }

        //const resolvedRanges = this.resolveVariables(variables)
        this.setVariables({ ...defaultValues, ...variables }) //ensures variables are instantiated
    }

    update() {
        /*
          this.vectors = new VectorMatrix(this.generateScaledGielisShape())
        */

        this.vectorMatrix = new VectorMatrix(this.getPoints())

    }

    //update any variable
    setVariables(newVariables: Partial<GielisVariables> = {}) {
        this.variables = { ...this.variables, ...newVariables };
        this.update();
        return this
    }

    gielisEquation(phi: number, variables: GielisVariables) {
        const { m, a, b, n1, n2, n3 } = variables;
        const cosPart = Math.abs(Math.cos((m * phi) / 4) / a) ** n2;
        const sinPart = Math.abs(Math.sin((m * phi) / 4) / b) ** n3;
        return (cosPart + sinPart) ** (-1 / n1);
    }

    scale(maxRadius: number) {
        this.vectorMatrix.scaleToRadius(maxRadius)
        return this
    }

    generateScaledGielisShape(maxRadius: number
    ): Vector[] {
        // Step 1: Calculate r_max_actual
        const rValues: number[] = [];
        for (let i = 0; i < this.variables.steps; i++) {
            const theta = (2 * Math.PI * i) / this.variables.steps;
            rValues.push(this.gielisEquation(theta, this.variables));
        }
        const rMaxActual = Math.max(...rValues);

        // Step 2: Scale r(theta) values
        const scaleFactor = maxRadius / rMaxActual;

        // Step 3: Generate scaled points
        const points: Vector[] = [];
        for (let i = 0; i < this.variables.steps; i++) {
            const theta = (2 * Math.PI * i) / this.variables.steps;
            const r = this.gielisEquation(theta, this.variables) * scaleFactor; // Scale the radius
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            points.push({ x, y });
        }
        return points;
    }


    getPoints() {
        const points = [];
        const steps = this.variables.steps;
        const stepSize = (2 * Math.PI) / steps;

        for (let i = 0; i <= steps; i++) {
            const phi = i * stepSize;
            const r = this.gielisEquation(phi, this.variables);

            // Convert polar coordinates to Cartesian coordinates
            const x = r * Math.cos(phi);
            const y = r * Math.sin(phi);
            points.push({ x, y });
        }
        return points
    }
}
