import {Vec2, Vec3 } from "cc";

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

    public static randomPointInAnnulus(origin: Vec3, minRadius: number, maxRadius: number): Vec3
    {
        let angle = Math.random() * 2 * Math.PI;
        let dir: Vec2 = new Vec2(Math.cos(angle), Math.sin(angle));

        let minRadius2 = minRadius * minRadius;
        let maxRadius2 = maxRadius * maxRadius;

        let distance: number = Math.sqrt(Math.random() * (maxRadius2 - minRadius2) + minRadius2);
        let pos: Vec3 = new Vec3(origin.x + dir.x * distance, origin.y, origin.z + dir.y * distance);
        return pos;
    }

    public static randomAngle(): number
    {
        return Math.random() * 2 * Math.PI * (180 / Math.PI);
    }    
}