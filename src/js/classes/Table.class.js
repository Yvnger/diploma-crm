import {createEl} from "../helpers.js";
import {Client} from "./Client.class.js";
import {getClients} from "../api.js";

export class Table {
    constructor() {
        this.table = createEl("div", "table");
        this.body = createEl("div", "table__body");
        this.spinner = createEl("span", "loading");
        this.clients = [];
        this._currentSort = "id";
        this._currentSortDirection = "asc";
        this._currentSortItem = null;
        this.sortParams = {
            id: "ID",
            name: "Фамилия Имя Отчество",
            createdAt: "Дата и время создания",
            updatedAt: "Последние изменения"
        };
    }

    createElement() {
        const element = createEl("div", "home__table");

        const head = createEl("div", "table__head");
        const headRow = this.createTableRow();

        const headId = this.createSortCell("id");
        const headName = this.createSortCell("name");
        const headCreatedAt = this.createSortCell("createdAt");
        const headUpdatedAt = this.createSortCell("updatedAt");
        const headContacts = this.createCell("Контакты");
        const headActions = this.createCell("Действия");

        // Appends
        element.append(this.table);
        this.table.append(head, this.body);
        head.append(headRow);
        headRow.append(headId, headName, headCreatedAt, headUpdatedAt, headContacts, headActions);

        return element;
    }

    createCell(inner) {
        const cell = createEl("div", "table__cell");
        if (typeof inner === "string") {
            cell.innerText = inner;
        } else if (typeof inner === "object") {
            cell.append(inner);
        }

        return cell;
    }

    createSortCell(sortBy) {
        const hint = createEl("div", "table__head-sort-hint");
        for (let i = 1; i <= 4; i++) {
            const span = createEl("span");
            span.innerText = i;
            hint.append(span);
        }

        const link = createEl("a", "table__head-sort");
        link.href = "javascript:void(0)";
        link.innerText = this.sortParams[sortBy];

        const caption = createEl("span", "table__head-sort-caption");
        if (sortBy === "name") {
            caption.innerText = "А-Я";
        } else if (sortBy === 'id') {
            this.currentSortItem = link;
        }

        link.append(caption, hint);

        link.addEventListener("click", () => {
            this.sortTableBy(sortBy, link, caption);
        });

        return this.createCell(link);
    }

    getClient(id) {
        return this.clients.find(item => item.id === id);
    }

    createTableRow() {
        return createEl("div", "table__row");
    }

    renderList(list = null) {
        if (list) {
            this.clearTableBody();
            this.clients.map(item => {
                this.body.append(item.createElement());
            });
        } else {
            this.isLoading = true;
            getClients()
                .then(response => {
                    for (let i = 0; i < response.length; i++) {
                        const client = new Client(response[i], this);
                        this.clients.push(client);
                    }

                    this.sortTableBy("id", this.currentSortItem);
                })
                .finally(() => {
                    this.isLoading = false;
                })
        }
    }

    // Геттеры и сеттеры
    set isLoading(boolean) {
        if (boolean) {
            this.clients = [];
            this.clearTableBody();
            this.body.append(this.spinner);
            this.body.classList.add("table__body--loading");
        } else {
            this.body.classList.remove("table__body--loading");
        }
    }

    get currentSort() {
        return this._currentSort;
    }

    set currentSort(value) {
        this._currentSort = value;
    }

    get currentSortDirection() {
        return this._currentSortDirection;
    }

    set currentSortDirection(value) {
        this._currentSortDirection = value;
    }

    get currentSortItem() {
        return this._currentSortItem;
    }

    set currentSortItem(item) {
        if (this.currentSortItem !== item) {
            const activeClass = "table__head-sort--active";
            if (this.currentSortItem) {
                this.currentSortItem.classList.remove(activeClass)
            }
            this._currentSortItem = item;
            this.currentSortItem.classList.add(activeClass);

            this.setItemDirection(this.currentSortItem, this.currentSortDirection);
        }
    }

    setItemDirection(item, dir) {
        if (item) {
            item.classList.remove("table__head-sort--asc", "table__head-sort--desc");
        }
        item.classList.add(`table__head-sort--${dir}`);
    }

    sortHint(parent, array, dir) {
        const result = [...array];

        if (dir === "asc") {
            result
                .sort((a, b) => a - b)
                .map(item => {

                });
        } else if (dir === "desc") {
            result
                .sort((a, b) => b - a)
                .map(item => {
                    const span = createEl("span");
                    span.innerText = item;
                    parent.append(span);
                });
        }
    }

    clearTableBody() {
        this.body.innerHTML = "";
    }

    sortTableBy(column, item, caption = null) {
        if (this.currentSort === column) {
            if (this.currentSortDirection === "asc") {
                this.currentSortDirection = "desc";
                this.setItemDirection(item, "desc");
                if (column === "name" && caption) {
                    caption.innerText = "Я-А";
                }
            } else {
                this.currentSortDirection = "asc";
                this.setItemDirection(item, "asc");
                if (column === "name" && caption) {
                    caption.innerText = "А-Я";
                }
            }
        } else {
            this.currentSort = column;
            this.currentSortItem = item;
            if (this.currentSortDirection !== "asc") {
                this.currentSortDirection = "asc";
            }
        }

        if (column === "id") {
            if (this.currentSortDirection === "asc") {
                this.clients.sort((a, b) => a.id - b.id);
            } else {
                this.clients.sort((a, b) => b.id - a.id);
            }
        } else if (column === "name") {
            if (this.currentSortDirection === "asc") {
                this.clients.sort((a, b) => {
                    if (a.fullName < b.fullName) {
                        return -1;
                    } else if (a.fullName > b.fullName) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            } else {
                this.clients.sort((a, b) => {
                    if (a.fullName < b.fullName) {
                        return 1;
                    } else if (a.fullName > b.fullName) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            }
        } else if (column === "createdAt" || column === "updatedAt") {
            if (this.currentSortDirection === "asc") {
                this.clients.sort((a, b) => new Date(a[column]).getTime() - new Date(b[column]).getTime());
            } else {
                this.clients.sort((a, b) => new Date(b[column]).getTime() - new Date(a[column]).getTime());
            }
        }

        this.renderList(this.clients);
    }
}