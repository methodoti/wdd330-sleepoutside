import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    this.productDetail = document.querySelector('.product-detail');
  }

  addToCart() {
    if (this.product?.Id) {
      this.addProductToCart(this.product);
    }
  }

  addProductToCart(product) {
    let cartItems = getLocalStorage('so-cart');
    if (cartItems === null) {
      cartItems = [];
    }

    // If the product already exists, increase quantity instead of adding duplicates.
    const productIndex = cartItems.findIndex((item) => item.Id === product.Id);
    if (productIndex >= 0) {
      // Backward compatibility: old items may not have Quantity yet.
      const currentQuantity = Number(cartItems[productIndex].Quantity);
      const safeQuantity =
        Number.isFinite(currentQuantity) && currentQuantity > 0
          ? Math.floor(currentQuantity)
          : 1;

      // Increment quantity when the product is already in the cart.
      cartItems[productIndex].Quantity = safeQuantity + 1;
    } else {
      // New entries start with a single unit selected.
      cartItems.push({ ...product, Quantity: 1 });
    }

    setLocalStorage('so-cart', cartItems);
  }

  renderProductDetails() {
    if (!this.product?.Id) {
      document.title = 'Sleep Outside | Product Not Found';
      this.productDetail.innerHTML = `
				<h2 class="divider">Product not found</h2>
				<p>We could not find the requested tent.</p>
			`;
      return;
    }

    // initialize variable for the visual indicator
    let suggestedRetailIndicator = '';
    let discountIndicator = '';

    // is there discount?
    if (this.product.FinalPrice < this.product.SuggestedRetailPrice) {
      // get suggested price
      const suggestedPrice = this.product.SuggestedRetailPrice;
      // calculate the discount amount
      const discountAmount = suggestedPrice - this.product.FinalPrice;
      // calculate the percentage for the flag
      const discountPercentage = Math.round(
        (discountAmount / suggestedPrice) * 100,
      );

      // html with the flag
      discountIndicator = `<p class="discount-badge">Save ${discountPercentage}%</p>`;

      // suggested retail price
      suggestedRetailIndicator = `<p class="suggested__price"><del>$${this.product.SuggestedRetailPrice}</del></p>`;
    }

    document.title = `Sleep Outside | ${this.product.Name}`;
    this.productDetail.innerHTML = `
			<h3>${this.product.Brand?.Name ?? ''}</h3>
			<h2 class="divider">${this.product.NameWithoutBrand ?? this.product.Name}</h2>
			<img
				class="divider"
				src="${this.product.Image}"
				alt="${this.product.NameWithoutBrand ?? this.product.Name}"
			/>
      ${discountIndicator}
			<p class="product-card__price">$${this.product.FinalPrice.toFixed(2)}</p>
			${suggestedRetailIndicator}
			<p class="product__color">${this.product.Colors?.[0]?.ColorName ?? ''}</p>
			<p class="product__description">${this.product.DescriptionHtmlSimple}</p>
			<div class="product-detail__add">
				<button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
			</div>
		`;
  }

  async init() {
    if (!this.productId) {
      this.renderProductDetails();
      return;
    }

    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    if (this.product?.Id) {
      document
        .getElementById('addToCart')
        .addEventListener('click', this.addToCart.bind(this));
    }
  }
}
