import axios from 'axios';
import {getRefreshToken} from './refreshToken';

const customAxios = axios.create();

customAxios.interceptors.response.use((response) => {
    return response;
    }, (error) => {
        console.log('hai un error con la llamada: ')
        console.log(error.config)
        const originalRequest = error.config;
        if(error.response.status===301 && !originalRequest._retry){
            originalRequest._retry = true;
            console.log('error 301')
        return axios.request(error.config);
        }
      if (error.response.status===402 && !originalRequest._retry) {

        originalRequest._retry = true;
        console.log(localStorage.getItem('accessToken'))
        console.log(localStorage.getItem('username'))
        getRefreshToken(localStorage.getItem('refreshToken'),localStorage.getItem('username'));   
        console.log("dd")
        console.log(localStorage.getItem('username'));
        console.log(error.config)
        console.log("ss")
        return axios.request(error.config);
      }
      return Promise.reject(error);
    });

export {customAxios};