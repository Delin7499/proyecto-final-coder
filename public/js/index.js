const email = document.getElementById('email').value;

console.log(email);

const productosContainer = document.getElementById('products');
const applyFiltersButton = document.getElementById('applyFilters');

const fetchProducts = (limit, page, sort) => {
  const fetchUrl =
    email === 'Admin'
      ? `/api/products?limit=${limit}&page=${page}&sort=${sort}`
      : `/api/products/user/${email}?limit=${limit}&page=${page}&sort=${sort}`;

  fetch(fetchUrl)
    .then((response) => response.json())
    .then((products) => {
      const productoslist = products.payload.map(
        (
          prod,
        ) => ` <div class="h-auto md:w-64 hover:shadow-md bg-white group relative rounded-md flex flex-col">
        <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200 lg:aspect-none group-hover:opacity-75">
          <img
            src="${prod.thumbnail}"
            alt="${prod.title}"
            class="h-full w-full object-cover object-center"
          />
        </div>
    
        <div class="p-4">
          <h3 class="text-sm text-gray-700">
            <a href="/product/${prod._id}">
              <span aria-hidden="true" class="absolute inset-0"></span>
              ${prod.title}
            </a>
          </h3>
          <p class="text-sm text-gray-500">${prod.description}</p>
          <p class="text-sm text-gray-500">Code: ${prod.code}</p>
          <p class="text-sm text-gray-500">Barcode: ${prod.barcode}</p>
          <p class="text-sm text-gray-500">Category: ${prod.category}</p>
          <p class="text-sm text-gray-500">Status: ${prod.status}</p>
          <div class="flex justify-between items-center mt-2">
            <p class="text-sm font-medium text-gray-900">$${prod.price}</p>
            <p class="text-sm text-gray-500">Stock: ${prod.stock}</p>
          </div>
          <p class="text-sm text-gray-500">Owner: ${prod.owner}</p>
          <button class="delete-product-button flex-auto relative self-center bg-blue-400 rounded-md hover:bg-blue-600" data-product-id="${prod._id}">Delete</button>
        </div>
      </div>`,
      );

      productosContainer.innerHTML = productoslist.join('');
      setupDeleteButtons();
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
    });
};

function setupDeleteButtons() {
  // Add event listeners for delete buttons
  const deleteButtons = document.querySelectorAll('.delete-product-button');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');

      // Send a delete request to your server
      fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
        .then(() => {
          Swal.fire({
            icon: 'success',
            text: 'Product deleted successfully!',
            timer: 1500,
          }).then(() => {
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
        });
    });
  });
}

if (productosContainer) {
  fetchProducts('9', '1', 'asc');
}

document.addEventListener('DOMContentLoaded', (event) => {
  const limitSelect = document.getElementById('limit');
  const pageInput = document.getElementById('page');
  const sortSelect = document.getElementById('sort');
  limitSelect.addEventListener('change', () => {
    fetchProducts(limitSelect.value, pageInput.value, sortSelect.value);

    console.log(limitSelect.value);
  });

  pageInput.addEventListener('input', () => {
    fetchProducts(limitSelect.value, pageInput.value, sortSelect.value);

    console.log(pageInput.value);
  });

  sortSelect.addEventListener('change', () => {
    fetchProducts(limitSelect.value, pageInput.value, sortSelect.value);

    console.log(sortSelect.value);
  });
});

//////////////////////////////////////////////
document.querySelectorAll("input[name='thumbnailType']").forEach((input) => {
  input.addEventListener('change', function () {
    const isURL = document.getElementById('thumbnailTypeURL').checked;
    document.getElementById('thumbnailURL').style.display = isURL
      ? 'block'
      : 'none';
    document.getElementById('thumbnailFile').style.display = isURL
      ? 'none'
      : 'block';
  });
});
