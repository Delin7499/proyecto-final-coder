const uid = document.getElementById('uid').getAttribute('data-id');
const userEmailll = document
  .getElementById('userEmail')
  .getAttribute('data-id');

if (userEmailll != 'Admin') {
  fetch('/api/users/profile')
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('greetMessage').textContent =
        `Hello, ${data.first_name}`;

      const premiumOrProducts = document.getElementById('premiumOrProducts');

      if (data.role === 'User') {
        premiumOrProducts.innerHTML = `<div id='uid' data-id='{{user._id}}'></div>
                                            <li><button
                                                  id='requestPremiumAccess'
                                                  class='flex-auto relative self-center bg-blue-400 rounded-md hover:bg-blue-600'
                                                  >Request Premium Access</button></li>`;
      } else {
        premiumOrProducts.innerHTML = `<li><a href='/realtimeproducts'>My Products</a></li>`;
      }

      const premiumButton = document.getElementById('requestPremiumAccess');
      if (premiumButton) {
        premiumButton.addEventListener('click', () => {
          const uid = document.getElementById('uid').getAttribute('data-id');
          fetch(`/api/users/premium/${uid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid }),
          }).then((data) => {
            if (data.status === 202) {
              Swal.fire({
                icon: 'success',
                text: 'You are now a premium user!',
                timer: 1500,
              }).then(() => {
                window.location.reload();
              });
            } else {
              data.json().then((response) => {
                Swal.fire({
                  icon: 'error',
                  text: response.message,
                  timer: 1500,
                });
              });
            }
          });
        });
      }
    });
} else {
  document.getElementById('greetMessage').textContent = `Hello, Admin`;
  const premiumOrProducts = document.getElementById('premiumOrProducts');
  premiumOrProducts.innerHTML = `<li><a href='/realtimeproducts'>Manage Products</a></li>`;

  const profileLink = document.getElementById('profileLink');
  profileLink.hidden = true;

  const ticketsLink = document.getElementById('ticketsLink');
  ticketsLink.hidden = true;

  const cartLink = document.getElementById('cartLink');
  cartLink.hidden = true;

  const manageUsers = document.getElementById('manageUsers');
  manageUsers.innerHTML = `<li><a href='/realtimeusers'>Manage Users</a></li>`;
}
