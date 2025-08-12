import { randomColorScheme } from "./color";
import { Gielis, type GielisVariables } from "./Gielis";

import type { ColorScheme } from "./color"
import { ranEven, ranInRange } from "./Functions";
import { VectorMatrices, VectorMatrix } from "./VectorMatrix";

/*
export class Corolla {
    vectorMatrices: VectorMatrices;
    
    constructor(
        public basePetal: Gielis = new Gielis(),
        public color: string,
        public repetitions: number,
        public radius: number,
        public petalScale: number,
        ) {
        
        this.vectorMatrices = basePetal.vectorMatrix.createCircularPattern(repetitions, radius)
        }
        
        getFlowerPart() {
            let flowerParts: FlowerPart[] = []
            this.vectorMatrices.vectors.map(v => {
        flowerParts.push(new FlowerPart(v, this.color))
        })
        return flowerParts
        }
        }
        */

export class FlowerPart {
    constructor(
        public vectors: VectorMatrix,
        public color: string,) {
    }
}

type FlowerVectors = (VectorMatrix | VectorMatrix[] | VectorMatrices)[];

export class Flower {
    background: null = null //implement later??
    colorScheme: ColorScheme;
    flowerParts: FlowerPart[] = [];
    offset: number;

    constructor(vectors: FlowerVectors = [], colorScheme: ColorScheme = randomColorScheme(), offset: number = 0) {
        this.offset = offset
        this.colorScheme = colorScheme
        let colors = colorScheme.colors
        let csl = colorScheme.colors.length //Color Scheme Length

        if (vectors instanceof VectorMatrix) {
            this.flowerParts.push(new FlowerPart(vectors, colors[0 % csl]));
            return;
        }

        if (Array.isArray(vectors)) {
            vectors.forEach((v, i) => {
                if (v instanceof VectorMatrix) {
                    this.flowerParts.push(new FlowerPart(v, colors[(i + this.offset) % csl]));
                } else if (v instanceof VectorMatrices) {
                    v.vectors.forEach((innerV, o) => {
                        if (innerV instanceof VectorMatrix) {
                            this.flowerParts.push(new FlowerPart(innerV, colors[(i + this.offset) % csl])); //All items in nested arrays get the same color
                        }
                    });
                }
            });
        }

        /*
         this.sepal.controller.gielis.setVariables({ m: 10 })
        
        const defaultPetalRanges: Ranges = {
            m_range: { min: 2, max: 19 },
            a_range: { min: 0.1, max: 2.4 },
            b_range: { min: 0.1, max: 0.4 },
            n1_range: { min: 1.5, max: 5.0 },
            n2_range: { min: 0.5, max: 4.0 },
            n3_range: { min: 0.5, max: 1.6 },
            steps_range: { min: 50, max: 200 }
        };
        
        */

        /*
        
        this.petals = Array.from({ length: petalCount }, (_, i) => {
            const f = 2
            return new FlowerPart(basePetal.gielis.points, colors[1 % schemeLength])
            
        }
        */
    }
}
