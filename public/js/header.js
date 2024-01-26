const uid = document.getElementById('uid').getAttribute('data-id');
document
  .getElementById('requestPremiumAccess')
  .addEventListener('click', () => {
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
