export function moveItem(arr, fromIndex, toIndex) {
    if (fromIndex < 0) {
        fromIndex = arr.length - fromIndex;
    }
    if (toIndex < 0) {
        toIndex = arr.length - toIndex;
    }
    const copiedArr = [...arr];
    if (fromIndex === toIndex) {
        return copiedArr;
    }

    const itemToMove = copiedArr.splice(fromIndex, 1)[0];

    copiedArr.splice(toIndex, 0, itemToMove);

    return copiedArr;
}
