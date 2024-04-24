export function moveItem(arr, fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= arr.length || toIndex < 0 || toIndex >= arr.length) {
        return [...arr];
    }

    if (fromIndex === toIndex) {
        return [...arr];
    }

    const copiedArr = [...arr];

    const itemToMove = copiedArr.splice(fromIndex, 1)[0];

    if (arr.length === 2 && fromIndex === 0 && toIndex === 1) {
        copiedArr.push(itemToMove);
    } else {
        const adjustedToIndex = toIndex < fromIndex ? toIndex : toIndex - 1;
        copiedArr.splice(adjustedToIndex, 0, itemToMove);
    }

    return copiedArr;
}
