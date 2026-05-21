import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
    return `
    <li class="product-card">
        <a href="product_pages/?product=${product.Id}">
        <img src="${product.Image} " alt="${product.Name} " />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.ListPrice}</p>
        </a>
    </li>`;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }
    renderList(list) {
        // pass every product in the template and creat a list of HTML's
        //const htmlStrings = list.map(productCardTemplate);
        // join the HTML pieces and inject in the element (<ul>)
        //this.listElement.insertAdjacentHTML('afterbegin', htmlStrings.join(''));

        // call the new universal tool passing: the template, the <ul>, and the list
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }

    async init() {
        const list = await this.dataSource.getData();
        // call renderList passing the list
        this.renderList(list);
    }
}