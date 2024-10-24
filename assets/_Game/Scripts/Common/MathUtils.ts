export default class MathUtils {
    public static getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    public static getRandomNumberFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static roundToTwoDecimal(num: number): string {
        return (Math.round(num * 100) / 100).toFixed(2);
    }

    public static roundToTwoDecimalNormalize(num: number): number {
        return Math.round(num * 100) / 100;
    }
}