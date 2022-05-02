const axios = require('axios').default;

export async function getRefreshToken(refreshToken) {
    return fetch(`http://${process.env.REACT_APP_URL_API}/refreshtoken`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'refreshToken': refreshToken
      }
    }).then(data => {
        data.json()

        if ('accessToken' in data) {
            localStorage.setItem('accessToken', JSON.stringify(data['accessToken']));
            localStorage.setItem('refreshToken', JSON.stringify(data['refreshToken']));
            localStorage.setItem('username', JSON.stringify(data['username']));
          } else {
          localStorage.removeItem('refreshToken', JSON.stringify(data['refreshToken']));
          localStorage.removeItem('accessToken', JSON.stringify(data['accessToken']));
          localStorage.removeItem('username', JSON.stringify(data['username']));
        }

    })
      

   }

