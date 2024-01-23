const socket = io("http://localhost:8080", {
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});
const email = document.getElementById("email").value;
console.log(email);
const productosContainer = document.getElementById("products");
if (productosContainer) {
  socket.on("products", (productos) => updateProducts(productos, email));
}
socket.on("products_update", (productos) => updateProducts(productos, email));

const form = document.querySelector("#productForm");
form.addEventListener("submit", submitForm);

const deleteForm = document.getElementById("deleteProductForm");
deleteForm.addEventListener("submit", deleteProduct);

const categoryForm = document.getElementById("addCategoryForm");
categoryForm.addEventListener("submit", addCategory);

const categorySelect = document.getElementById("category");
socket.on("categories", populateCategories);

function updateProducts(productos, email) {
  const filteredProductos = productos.filter((prod) => prod.owner === email);
  const productoslist = filteredProductos.map((prod) => getProductHTML(prod));
  productosContainer.innerHTML = productoslist.join("");
}

function submitForm(event) {
  event.preventDefault();
  const formData = getFormData();
  fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).catch((error) => {
    console.error("Error:", error);
  });
}

function deleteProduct(e) {
  e.preventDefault();
  const productId = document.getElementById("deleteId").value;
  fetch(`/api/products/${productId}`, {
    method: "DELETE",
  }).catch((error) => {
    console.error("Error:", error);
  });
}

function addCategory(e) {
  e.preventDefault();
  const categoryName = document.getElementById("categoryName").value;
  fetch(`/api/products/category/${categoryName}`, {
    method: "POST",
  }).catch((error) => {
    console.error("Error:", error);
  });
}

function populateCategories(categories) {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

function getProductHTML(prod) {
  return `<div id="${prod._id}" class="product">
    <h2>${prod.title}</h2>
    <p>Id: ${prod._id}</p>
    <p>Description: ${prod.description}</p>
    <p>Code: ${prod.code}</p>
    <p>Stock: ${prod.stock}</p>
    <p>Category: ${prod.category}</p>
    <img src="${prod.thumbnail}" alt="${prod.title} Image" />
    <p class="price">Price: $ ${prod.price}</p>
  </div>`;
}

function getFormData() {
  return {
    title: document.querySelector("#title").value,
    description: document.querySelector("#description").value,
    code: document.querySelector("#code").value,
    price: parseFloat(document.querySelector("#price").value),
    status: document.querySelector("#status").checked,
    stock: parseInt(document.querySelector("#stock").value),
    category: document.querySelector("#category").value,
    thumbnail: document.querySelector("#thumbnail").value,
  };
}
