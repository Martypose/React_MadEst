const axios = require('axios').default;
export async function getRefreshToken(refreshToken,username) {
  console.log("refresh token es "+refreshToken)
    return axios.get(`http://${process.env.REACT_APP_URL_API}/refreshtoken`, {
      headers: {
        'Content-Type': 'application/json',
        'refreshToken': refreshToken,
        'username': username
      }
    }).then(response => {
        console.log('pidiendo accesToken con refresh')

        console.log(response)
        if ('accessToken' in response.data) {
          console.log('me sirven los tokens')
          localStorage.setItem('accessToken', response.data['accessToken'].accessToken);
          localStorage.setItem('refreshToken', response.data['refreshToken'].refreshToken);
          localStorage.setItem('username', response.data['username']);
          } else {
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('username');
        }

    }).catch(error => {
      console.log(error)

    })
      
   }

