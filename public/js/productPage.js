window.onload = function () {
  const cartContainer = document.getElementById('cartID');
  const cid = cartContainer.getAttribute('data-id');
  const productsContainer = document.getElementById('productPage');
  const pid = productsContainer.getAttribute('data-id');

  console.log(cid, pid);

  fetch(`/api/products/${pid}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementById('productThumbnail').src = data.thumbnail;
      document.getElementById('productTitle').textContent = data.title;
      document.getElementById('productDescription').textContent =
        data.description;
      document.getElementById('productPrice').textContent = data.price;
      document.getElementById('productStock').textContent = data.stock;
    });

  const addToCart = document.getElementById('addToCart');

  addToCart.addEventListener('click', () => {
    const quantity = document.getElementById('quantity');
    fetch(`/api/carts/${cid}/product/${pid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: quantity.value,
      }),
    })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      })
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Added to cart!',
          showConfirmButton: false,
          timer: 1500,
        });
      });
  });
};
