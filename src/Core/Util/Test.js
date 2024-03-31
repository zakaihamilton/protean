function getComponentPermutations(components) {
    const permutations = [];
    for (let i = 0; i < components.length; i++) {
        for (let j = i + 1; j < components.length; j++) {
            permutations.push([components[i], components[j]]);
        }
    }
    return permutations;
}

export function testPermutations(components, params = []) {
    if (components.length <= 1) {
        return null;
    }

    const permutations = getComponentPermutations(components).map(([source, target]) => {
        const sourceIndex = components.findIndex(component => component.name === source.name), targetIndex = components.findIndex(component => component.name === target.name);
        const sourceParams = params[sourceIndex], targetParams = params[targetIndex];
        const permutation = [source.name, target.name, [source, target], [sourceParams, targetParams]];
        return permutation;
    });

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
