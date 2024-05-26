function getComponentPermutations(components) {
    const permutations = [];
    const keys = Object.keys(components);
    for (let i = 0; i < keys.length; i += 2) {
        const sourceKey = keys[i], targetKey = keys[i === keys.length - 1 ? 0 : i + 1];
        let source = components[sourceKey], target = components[targetKey];
        permutations.push([source, target, sourceKey, targetKey]);
    }
    return permutations;
}

export function testPermutations(components, params = {}) {
    if (components.length <= 1) {
        return null;
    }

    const permutations = getComponentPermutations(components).map(([source, target, sourceKey, targetKey]) => {
        const sourceParams = params[sourceKey], targetParams = params[targetKey];
        const permutation = [sourceKey, targetKey, [source, target], [sourceParams, targetParams]];
        return permutation;
    });

    return permutations;
}

export async function testMethod(instances, method, ...params) {
    let result = [];
    for (let i = 0; i < instances.length; i++) {
        const instance = instances[i];
        if (typeof instance[method] !== 'function') {
            throw new Error(`instance does not have method: ${method}`);
        }
        result.push(await instance[method](...params));
    }
    return result;
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

export function bindFunctions(component, ...params) {
    const clone = {};
    const keys = Object.keys(component);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (params.length) {
            clone[key] = component[key].bind(component, ...params);
        } else {
            clone[key] = component[key];
        }
    }

    return clone;
}

export function testInstance(components, params = []) {
    const instances = [];
    for (let i = 0; i < components.length; i++) {
        instances.push(bindFunctions(components[i], ...(params[i] || [])));
    }
    return instances;
}
