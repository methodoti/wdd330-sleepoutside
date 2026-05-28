import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  // initialize variable for the visual indicator
  let discountIndicator = '';
  let suggestedRetailIndicator = '';

  // is there discount?
  if (product.FinalPrice < product.SuggestedRetailPrice) {
    // flag as discounted with %
    const discountAmount = product.SuggestedRetailPrice - product.FinalPrice;
    // const discountPercentage = Math.round((discountAmount / product.SuggestedRetailPrice) * 100);
    const suggestedPrice = product.SuggestedRetailPrice;
    const discountPercentage = Math.round(
      (discountAmount / suggestedPrice) * 100,
    );

    // html with the flag
    discountIndicator = `<p class="discount-badge">Save ${discountPercentage}%</p>`;

    // suggested retail price
    suggestedRetailIndicator = `<p class="suggested__price"><del>$${product.SuggestedRetailPrice}</del></p>`;
  }

  return `
    <li class="product-card">
        <a href="/product_pages/index.html?product=${product.Id}">
        ${discountIndicator}
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
        ${suggestedRetailIndicator}
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
    // const list = await this.dataSource.getData();
    const list = await this.dataSource.getData(this.category);
    // call renderList passing the list
    this.renderList(list);

    // Update the H2 dinamicaly
    document.querySelector('.products h2').innerHTML =
      `Top Products: ${this.category}`;
  }
}
