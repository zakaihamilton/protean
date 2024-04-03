export function className(...classes) {
    return classes.filter(Boolean).join(" ");
}
