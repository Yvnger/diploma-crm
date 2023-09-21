export function createHeader() {
    const main = document.createElement('header');
    main.classList.add('header');

    const headerContainer = document.createElement('div');
    headerContainer.classList.add('container--fluid');

    const headerInner = document.createElement('div');
    headerInner.classList.add('header__inner');

    const headerLogo = document.createElement('span');
    headerLogo.classList.add('header__logo');

    // Поиск
    const searchForm = document.createElement('form');
    searchForm.classList.add('header__search', 'search');
    searchForm.setAttribute('type', 'javascript:void(0)');

    const searchInput = document.createElement('input');
    searchInput.classList.add('search__input');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('placeholder', 'Введите запрос')

    const searchResultWrap = document.createElement('div');
    searchResultWrap.classList.add('search__result-wrap');

    const searchResultList = document.createElement('ul');
    searchResultList.classList.add('search__result-list');

    // Appends
    main.append(headerContainer);
    headerContainer.append(headerInner);
    headerInner.append(headerLogo);
    headerInner.append(searchForm);
    searchForm.append(searchInput);
    searchForm.append(searchResultWrap);
    searchResultWrap.append(searchResultList);

    return {main, searchForm, searchInput, searchResultWrap, searchResultList};
}