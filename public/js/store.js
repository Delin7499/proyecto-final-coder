const productosContainer = document.getElementById('products');
const applyFiltersButton = document.getElementById('applyFilters');
if (applyFiltersButton) {
  applyFiltersButton.addEventListener('click', function () {
    const limit = document.getElementById('limit').value;
    const page = document.getElementById('page').value;
    const sort = document.getElementById('sort').value;

    // Fetch products with the selected filters (limit, page, sort)
    fetchProducts(limit, page, sort);
  });
}

const fetchProducts = (limit, page, sort) => {
  fetch(`/api/products?limit=${limit}&page=${page}&sort=${sort}`)
    .then((response) => response.json())
    .then((products) => {
      const productoslist = products.payload.map(
        (
          prod,
        ) => `<div class="h-auto w-64 hover:shadow-md bg-white group relative rounded-md flex-grow id=${prod._id}">
        <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <img
            src="${prod.thumbnail}"
            alt="${prod.title}"
            class="h-full w-full object-cover object-center lg:h-full lg:w-full"
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
        </div>
      </div>`,
      );

      productosContainer.innerHTML = productoslist.join('');
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
    });
};

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
