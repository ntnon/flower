export class Petal {
    distFromCenter: number;
    color: string;
    width: number;
    length: number;
    angle: number;
    rotation: number;
    id: number;

    constructor(distFromCenter: number, angle: number, color: string, width: number, length: number, rotation: number, id: number) {
        this.distFromCenter = distFromCenter;
        this.angle = angle;
        this.color = color;
        this.width = width;
        this.length = length;
        this.rotation = rotation;
        this.id = id
    }

}

export class Flower {
    name: string;
    pistilColor: string;
    pistilSize: number;
    petalColor: string;
    petalWidth: number;
    petalLength: number;
    petalCount: number;
    x: number;
    y: number;
    rotation: number;
    distFromCenter: number;
    petals: Petal[] = [];

    constructor(pistilColor: string, pistilSize: number, petalCount: number, petalColor: string, petalWidth: number, petalLength: number, distFromCenter: number, rotation: number = 0, x: number = 0, y: number = 0,) {
        this.name = 'Flower';
        this.pistilColor = pistilColor;
        this.pistilSize = pistilSize;
        this.petalColor = petalColor;
        this.petalWidth = petalWidth;
        this.petalLength = petalLength;
        this.petalCount = petalCount;
        this.distFromCenter = distFromCenter;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.petals = this.grow()
    }

    grow() {
        let petals = []
        const petalIncrement = 360 / this.petalCount;

        for (let i = 0; i < this.petalCount; i++) {
            let angle = petalIncrement * i;
            let rotation = petalIncrement * i;
            let p = new Petal(this.distFromCenter, angle, this.petalColor, this.petalWidth, this.petalLength, rotation, i);
            petals.push(p);
        }
        return petals;
    }

}

export class Bouquet {
    flowers: Flower[]

    constructor(flowers: Flower[] = []) {
        this.flowers = flowers;
    }

    createFlower() {
        let flower = new Flower('yellow', 40, 5, 'red', 40, 50, 40)
        this.addFlower(flower)
        return flower

    }

    addFlower(flower: Flower) {
        this.flowers.push(flower);
    }

    setFlowers(flowers: Flower[]) {
        this.flowers = flowers;
    }

    removeFlower(flower: Flower) {
        const index = this.flowers.indexOf(flower);
        this.flowers.splice(index, 1);
    }

    generateRandomFlower() {
        const pestilColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        const petalColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        const petalCount = Math.floor(Math.random() * 10) + 1;
        const petalWidth = Math.floor(Math.random() * 50) + 1;
        const petalLength = Math.floor(Math.random() * 50) + 1;
        const rotation = Math.floor(Math.random() * 360);
        const distFromCenter = Math.floor(Math.random() * 50) + 1;

        return new Flower(pestilColor, 40, petalCount, petalColor, petalWidth, petalLength, distFromCenter, rotation)
    }
}
