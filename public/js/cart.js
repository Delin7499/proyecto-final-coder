const cartContainer = document.getElementById('cart');
const productsContainer = document.getElementById('products');
const cartId = cartContainer.getAttribute('data-id');

if (cartContainer) {
  const cartId = cartContainer.getAttribute('data-id');

  fetchCartData();
}

function fetchCartData() {
  fetch(`/api/carts/my-cart`)
    .then((response) => response.json())
    .then((cart) => {
      renderCartProducts(cart.products);
      setupDeleteButtons();
    })
    .catch((error) => {
      console.error('Error fetching cart data:', error);
    });
}

function renderCartProducts(products) {
  const productsList = products.map((prod) => {
    return `
    <div  class=" h-auto w-64 hover:shadow-md bg-white group relative rounded-md flex-grow id=${prod.product._id}">
    <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
      <img
        src="${prod.product.thumbnail}"
        alt="${prod.product.title}"
        class="h-full w-full object-cover object-center lg:h-full lg:w-full"
      />
    </div>

    <div class="h-20 mt-4 flex justify-between">
      <div>
        <h2 class="text-sm text-gray-700">
          <a href="${prod.product.title}">
            <span aria-hidden="true" class="relative inset-0" />
            ${prod.product.title}
          </a>
        </h3>
      </div>
      <p class="mt-1 text-sm text-gray-500 absolute bottom-4 left-3">
       ${prod.product.category}
      </p>

      <p class="text-sm font-medium text-gray-900 "> $${prod.product.price}</p>
    </div>
    <h3 class="text-sm text-gray-500 absolute bottom-0 left-3">${prod.quantity}</h3>
    <button class="delete-product-button" data-product-id="${prod.product._id}">Delete</button>
  </div>`;
  });

  // Update the products container with the rendered products
  productsContainer.innerHTML = productsList.join('');
}

function setupDeleteButtons() {
  // Add event listeners for delete buttons
  const deleteButtons = document.querySelectorAll('.delete-product-button');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
      const cartId = cartContainer.getAttribute('data-id');

      // Send a delete request to your server
      fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((cartData) => {
          renderCartProducts(cartData.products);
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
        });
    });
  });
}
