export function ranInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function ranEven(min: number, max: number) {
    let random = Math.floor(Math.random() * ((max - min) / 2)) * 2 + min;
    return random;
}