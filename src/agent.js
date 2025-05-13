import superagent from 'superagent';
import { API_BASE_URL } from './config/apiConfig';
import commonStore from './stores/commonStore';
const handleErrors = err => {
    if (err?.response?.status === 401) {
      window.location.href = "/login";
    }
    throw err;
  };
  
  const tokenPlugin = req => {
    console.log("TOKEN", commonStore.token);
    if (commonStore.token) {
      req.set('Authorization', `Bearer ${commonStore.token}`);
    }
    req.withCredentials(); 
  };
  
  const responseBody = res => res.body;
  
  const requests = {
    get: url =>
      superagent
        .get(`${API_BASE_URL}${url}`)
        .use(tokenPlugin)
        .withCredentials() 
        .then(responseBody)
        .catch(handleErrors),
  
    post: (url, body) =>
      superagent
        .post(`${API_BASE_URL}${url}`)
        .send(body)
        .use(tokenPlugin)
        .withCredentials() 
        .then(responseBody)
        .catch(handleErrors),
  
    put: (url, body) =>
      superagent
        .put(`${API_BASE_URL}${url}`)
        .send(body)
        .use(tokenPlugin)
        .withCredentials() 
        .then(responseBody)
        .catch(handleErrors),
  
    delete: url =>
      superagent
        .del(`${API_BASE_URL}${url}`)
        .use(tokenPlugin)
        .withCredentials() 
        .then(responseBody)
        .catch(handleErrors),
  };
  
  export default requests;