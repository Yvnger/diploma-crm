import {createEl} from "../helpers.js";
import {getClients} from "../api.js";

export class Search {
    constructor(table) {
        this.table = table;
        this.input = createEl("input", "search__input");
        this.input.placeholder = "Введите запрос";
        this.activeClass = "search__result-wrap--has-results";
        this.resultsWrap = createEl("div", "search__result-wrap");
        this.resultsList = createEl("div", "search__result-list");
        this.results = [];
        this.searchRequestTimer = null;
    }

    element() {
        const form = createEl("form", "header__search", "search");

        // Appends
        form.append(this.input, this.resultsWrap);
        this.resultsWrap.append(this.resultsList);

        // Events
        this.input.addEventListener("input", () => {
            if (this.searchRequestTimer) {
                clearTimeout(this.searchRequestTimer);
            }

            this.searchRequestTimer = setTimeout(() => getClients(this.input.value)
                .then(response => {
                    if (this.input.value.length > 0) {
                        this.results = response.map(({id, name, surname, lastName}) => ({
                            id,
                            name: `${surname} ${name} ${lastName}`
                        }));

                        this.showResults();
                    } else {
                        this.displayList(false);
                    }
                }), 300)
        })

        this.input.addEventListener("click", () => {
            if (this.input.value.length > 0 && !this.resultsWrap.classList.contains(this.activeClass)) {
                this.displayList(true);
            }
        })

        document.body.addEventListener('click', (event) => {
            if (!this.input.contains(event.target) && !this.resultsWrap.contains(event.target)) {
                this.displayList(false); // закрыть wrap
            }
        });

        return form;
    }

    createResultItem(data) {
        const item = createEl("li", "search__result-item");
        item.innerText = data.name;

        item.addEventListener('click', () => {
            const client = this.table.getClient(data.id);
            client.markElement();
            this.displayList(false);
        })

        return item;
    }

    showResults() {
        if (this.results.length > 0) {
            this.resultsList.innerHTML = "";
            this.displayList(true);

            for (let i = 0; i < this.results.length; i++) {
                this.resultsList.append(this.createResultItem(this.results[i]));
            }
        } else {
            this.resultsList.innerHTML = '';
            this.displayList(false);
        }
    }

    displayList(boolean) {
        if (boolean) {
            this.resultsWrap.classList.add(this.activeClass)
        } else {
            this.resultsWrap.classList.remove(this.activeClass)
        }
    }
}