export function createEl(tag, ...classes) {
    const element = document.createElement(tag);

    if (classes.length > 0) {
        element.classList.add(...classes);
    }

    return element;
}



export function padNumber(number) {
    return number < 10 ? '0' + number : number;
}