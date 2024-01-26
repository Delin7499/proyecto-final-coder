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
  console.log(products);
  const productsList = products.map((prod) => {
    return `
  
  <div class="h-auto w-64 hover:shadow-md bg-white group relative rounded-md flex-grow id=${prod._id}">
        <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <img
            src="${prod.product.thumbnail}"
            alt="${prod.product.title}"
            class="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </div>
    
        <div class="p-4">
          <h3 class="text-sm text-gray-700">
            <a href="/product/${prod.product._id}">
              <span aria-hidden="true" class="absolute inset-0"></span>
              ${prod.product.title}
            </a>
          </h3>
          <p class="text-sm text-gray-500">${prod.product.description}</p>
          <p class="text-sm text-gray-500">Code: ${prod.product.code}</p>
          <p class="text-sm text-gray-500">Barcode: ${prod.product.barcode}</p>
          <p class="text-sm text-gray-500">Category: ${prod.product.category}</p>
          <p class="text-sm text-gray-500">Status: ${prod.product.status}</p>
          <div class="flex justify-between items-center mt-2">
            <p class="text-sm font-medium text-gray-900">$${prod.product.price}</p>
            <p class="text-sm text-gray-500">Stock: ${prod.product.stock}</p>
          </div>
          <p class="text-sm text-gray-500">Owner: ${prod.product.owner}</p>
          <h3 class="text-sm text-black ">Quantity: ${prod.quantity}</h3>
        </div>
        <button class="delete-product-button flex-auto relative self-center bg-blue-400 rounded-md hover:bg-blue-600" data-product-id=" Quantity:${prod.product._id}">Delete</button>
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
        .then(() => {
          fetchCartData();
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
        });
    });
  });
}
