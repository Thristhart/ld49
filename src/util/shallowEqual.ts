// adapted from https://github.com/facebook/fbjs/blob/main/packages/fbjs/src/core/shallowEqual.js

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function shallowEqual(objA: unknown, objB: unknown): boolean {
    if (objA === objB) {
        return true;
    }

    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
        return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    for (let i = 0; i < keysA.length; i++) {
        // @ts-ignore screw it
        if (!hasOwnProperty.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
        }
    }

    return true;
}
