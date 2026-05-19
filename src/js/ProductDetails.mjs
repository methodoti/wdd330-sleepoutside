import { qs } from './utils.mjs';

function renderProductDetails(product) {
  return `<section class="product-detail">
        <h3>${product.Brand.Name}</h3>

        <h2 class="divider">${product.NameWithoutBrand}</h2>

        <img
          class="divider"
          src="${product.Image}"
          alt="${product.NameWithoutBrand}"
        />

        <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>

        <p class="product__color">${product.Colors[0]?.ColorName ?? ''}</p>

        <p class="product__description">
          ${product.DescriptionHtmlSimple}
        </p>

        <div class="product-detail__add">
          <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
        </div>
      </section>`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = null;
  }

  async init() {
    if (!this.productId) {
      return;
    }

    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      return;
    }

    this.renderProductDetails();
  }

  renderProductDetails() {
    const productContainer = qs('.product-detail');

    if (!productContainer) {
      return;
    }

    productContainer.outerHTML = renderProductDetails(this.product);
  }
}