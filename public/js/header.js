const uid = document.getElementById('uid').getAttribute('data-id');

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
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            alert(data.message);
          });
      });
    }
  });
