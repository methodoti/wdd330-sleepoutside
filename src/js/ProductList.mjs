import { renderListWithTemplate } from "./utils.mjs";

// template function to create the html for a product card
function productCardTemplate(product) {
        return `
            <li class="product-card">
                <a href="/product_pages/product.html?product=${product.Id}">
                    <img
                        src="${product.Image}"
                        alt="${product.NameWithoutBrand ?? product.Name}"
                    />
                    <h3 class="card__brand">${product.Brand?.Name ?? ''}</h3>
                    <h2 class="card__name">${product.NameWithoutBrand ?? product.Name}</h2>
                    <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
                </a>
            </li>
        `;
    }

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }
    // initialize the product list by fetching the data and rendering the list
    async init() {
        const list = await this.dataSource.getData();
        this.renderList(list);
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}