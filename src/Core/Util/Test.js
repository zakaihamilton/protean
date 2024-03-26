export function testPermutations(components, params = []) {
    if (components.length <= 1) {
        return null;
    }

    const permutations = [];
    const stack = [];
    stack.push({ remaining: components.slice(), current: null });

    while (stack.length) {
        const { remaining, current } = stack.pop();

        if (remaining.length === 0) {
            const source = current[0], target = current[1];
            const sourceIndex = components.findIndex(component => component.name === source.name), targetIndex = components.findIndex(component => component.name === target.name);
            const sourceParams = params[sourceIndex], targetParams = params[targetIndex];
            const permutation = [source.name, target.name, [source, target], [sourceParams, targetParams]];
            permutations.push(permutation);
            continue;
        }

        for (let i = 0; i < remaining.length; i++) {
            const nextComponent = remaining[i];
            const remainingComponents = remaining.slice(0, i).concat(remaining.slice(i + 1));
            const updatedCurrent = current ? [...current, nextComponent] : [nextComponent];
            stack.push({ remaining: remainingComponents, current: updatedCurrent });
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

export function testInstance(components, params = []) {
    const instances = [];
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        instances.push(new component(...(params[i] || [])));
    }
    return instances;
}
