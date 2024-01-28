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
      renderCartItems(cart.products);
      updateTotalValue(cart.products);
      setupDeleteButtons();
    })
    .catch((error) => {
      console.error('Error fetching cart data:', error);
    });
}

document
  .getElementById('purchaseButton')
  .addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Assuming you are sending a POST request
    fetch(`/api/tickets/${cartId}/purchase`, {
      method: 'POST',
      // Add any necessary headers, body, etc.
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Assuming 'data' is the response in JSON format as you mentioned
        if (data.notPurchasedProducts.length === 0) {
          Swal.fire({
            icon: 'success',
            title: 'Purchase completed!',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.reload();
          });
        } else {
          let notPurchasedProducts = data.notPurchasedProducts.map((prod) => {
            console.log(prod);
            return ` ${prod.product.title} `;
          });
          Swal.fire({
            icon: 'success',
            title: `Sorry, the following products are out of stock: ${notPurchasedProducts}`,
          }).then(() => {
            window.location.reload();
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        }).then(() => {
          window.location.reload();
        });
      });
  });

function displayMessage(message) {
  const messageContainer = document.createElement('div');
  messageContainer.textContent = message;
  document.body.appendChild(messageContainer);

  // Style the message container as needed
  messageContainer.style.color = 'green'; // Example styling
  messageContainer.style.marginTop = '20px'; // Example styling
}

function renderCartProducts(products) {
  console.log(products);
  const productsList = products.map((prod) => {
    return `
      
      
      <div class="h-auto md:w-64 hover:shadow-md bg-white group relative rounded-md flex flex-col">
        <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200 lg:aspect-none group-hover:opacity-75">
          <img
            src="${prod.product.thumbnail}"
            alt="${prod.product.title}"
            class="h-full w-full object-cover object-center"
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
          <button class="delete-product-button flex-auto relative self-center bg-blue-400 rounded-md hover:bg-blue-600" data-product-id="${prod.product._id}">Delete</button>
        </div>
    </div>`;
  });

  // Update the products container with the rendered products
  productsContainer.innerHTML = productsList.join('');
}

// Function to render cart items
const renderCartItems = (cartProducts) => {
  if (cartProducts.length === 0) {
    document.getElementById('purchaseButton').disabled = true;
  }
  cartItems.innerHTML = ''; // Clear existing items
  cartProducts.forEach((product, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
          <div class="flex">
              <h3 class="flex-1">${product.quantity}X ${
                product.product.title
              }</h3>
              <p>$${product.product.price * product.quantity}</p>
          </div>
      `;
    cartItems.appendChild(listItem);
  });
};

const updateTotalValue = (cartProducts) => {
  const totalValueElement = document.getElementById('totalValue');
  console.log(cartProducts);
  const total = cartProducts.reduce((acc, product) => {
    return acc + product.product.price * product.quantity;
  }, 0);
  totalValueElement.textContent = `$${total}`;
};

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
