import { ranEven, ranInRange } from "./Functions";
import { Gielis, type GielisVariables } from "./Gielis";


export class GielisControl {
    m_range: [number, number] = [4, 12]
    a_range: [number, number] = [0.5, 1.5];
    b_range: [number, number] = [0.5, 1.5]
    n1_range: [number, number] = [0.5, 3.5]
    n2_range: [number, number] = [0.5, 3.5]
    n3_range: [number, number] = [0.5, 3.5]
    steps_range: [number, number] = [0, 700]
    gielis: Gielis = new Gielis()

    constructor(ranges: Partial<GielisControl> = {}) {
        this.updateRanges(ranges)
        this.gielis.setVariables(this.randomize())
    }

    randomize(): GielisVariables {
        return {
            m: ranEven(this.m_range[0], this.m_range[1]),
            a: ranInRange(this.a_range[0], this.a_range[1]),
            b: ranInRange(this.b_range[0], this.b_range[1]),
            n1: ranInRange(this.n1_range[0], this.n1_range[1]),
            n2: ranInRange(this.n2_range[0], this.n2_range[1]),
            n3: ranInRange(this.n3_range[0], this.n3_range[1]),
            steps: ranInRange(this.steps_range[0], this.steps_range[1])
        };
    }

    updateRanges(ranges: Partial<GielisControl> = {}) {
        this.m_range = ranges.m_range || this.m_range
        this.a_range = ranges.a_range || this.a_range
        this.b_range = ranges.b_range || this.b_range
        this.n1_range = ranges.n1_range || this.n1_range
        this.n2_range = ranges.n2_range || this.n2_range
        this.n3_range = ranges.n3_range || this.n3_range
        this.steps_range = ranges.steps_range || this.steps_range
    }
}
