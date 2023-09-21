export function createElementWithClass(tag, ...classes) {
    const item = document.createElement(tag);
    item.classList.add(...classes);

    return item;
}