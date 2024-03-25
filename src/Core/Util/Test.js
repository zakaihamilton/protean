export function testPermutations(components) {
    if (components.length <= 1) {
        return null;
    }

    const permutations = [];
    const stack = [];
    stack.push({ components: components.slice(), current: null });

    while (stack.length) {
        const { components, current } = stack.pop();

        if (components.length === 0) {
            const source = current[0], target = current[1];
            permutations.push([source.name, target.name, [source, target]]);
            continue;
        }

        for (let i = 0; i < components.length; i++) {
            const nextComponent = components[i];
            const remainingComponents = components.slice(0, i).concat(components.slice(i + 1));
            const updatedCurrent = current ? [...current, nextComponent] : [nextComponent];
            stack.push({ components: remainingComponents, current: updatedCurrent });
        }
    }

    return permutations;
}

export async function testMethod(instances, method, ...params) {
    let result = [];
    for (let i = 0; i < instances.length; i++) {
        const instance = instances[i];
        result.push(await instance[method](...params));
    }
    return result;
}

export async function testResults(results, cb) {
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        await cb(result, i);
    }
}

export function testCompare(values) {
    if (values.length <= 1) {
        throw new Error("Not enough values to compare");
    }
    const referenceValue = values[0];
    function deepCompare(value) {
        if (value === referenceValue) {
            return true;
        }
        if (typeof value !== typeof referenceValue) {
            return false;
        }

        if (Array.isArray(value) && Array.isArray(referenceValue) && Object.keys(value).length !== Object.keys(referenceValue).length) {
            return false;
        }

        if (typeof value === 'object' && value !== null) {
            for (const key in value) {
                if (!deepCompare(value[key])) {
                    return false;
                }
            }
            return true;
        }

        return value === referenceValue;
    }

    return values.every(value => deepCompare(value));
}

export function testInstance(components, ...params) {
    const instances = [];
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        instances.push(new component(...params));
    }
    return instances;
}
