export function createMain(title) {
    const main = document.createElement('main');
    main.classList.add('home');

    const mainContainer = document.createElement('div');
    mainContainer.classList.add('container');

    const mainTitle = document.createElement('h1');
    mainTitle.classList.add('home__title');
    mainTitle.innerText = title;

    const mainContent = document.createElement('div');
    mainContent.classList.add('home__table');

    const addButtonWrap = document.createElement('div');
    addButtonWrap.classList.add('home__btn-bottom');

    const addButton = document.createElement('button');
    addButton.classList.add('btn', 'btn--outline', 'btn--add-client', 'btn--fixed');
    addButton.innerText = 'Добавить клиента';

    // Appends
    main.append(mainContainer);
    mainContainer.append(mainTitle);
    mainContainer.append(mainContent);
    mainContainer.append(addButtonWrap);

    addButtonWrap.append(addButton);

    return {main, mainContent, addButton};
}