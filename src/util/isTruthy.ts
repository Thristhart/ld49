export function isTruthy<T>(x: T | null | undefined | false | 0 | ""): x is T {
    return !!x;
}
