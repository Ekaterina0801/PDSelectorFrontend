import superagent from 'superagent';
import { API_BASE_URL } from './config/apiConfig';
import commonStore from './stores/commonStore';
const handleErrors = err => {
  if (err?.response?.status === 401) {
    window.location.href = '/login'
  }
  throw err
}

const tokenPlugin = req => {
  const token = commonStore.token
  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }
  req.withCredentials()
}

const requests = {
  /**
   * @param {string} url
   * @param {{ responseType?: string }} [config]
   * @returns {Promise<any|Blob>}
   */
  get: (url, config = {}) => {
    const req = superagent
      .get(`${API_BASE_URL}${url}`)
      .use(tokenPlugin)

    if (config.responseType === 'blob') {
      req.responseType('blob')
    }

    return req
      .then(res => {
        if (config.responseType === 'blob') {
          // superagent хранит blob в res.xhr.response
          return res.xhr.response
        }
        return res.body
      })
      .catch(handleErrors)
  },

  post: (url, body, config = {}) => {
    const req = superagent
      .post(`${API_BASE_URL}${url}`)
      .send(body)
      .use(tokenPlugin)

    if (config.responseType === 'blob') {
      req.responseType('blob')
    }

    return req
      .then(res => (config.responseType === 'blob' ? res.xhr.response : res.body))
      .catch(handleErrors)
  },

  put: (url, body, config = {}) => {
    const req = superagent
      .put(`${API_BASE_URL}${url}`)
      .send(body)
      .use(tokenPlugin)

    if (config.responseType === 'blob') {
      req.responseType('blob')
    }

    return req
      .then(res => (config.responseType === 'blob' ? res.xhr.response : res.body))
      .catch(handleErrors)
  },

  delete: (url, config = {}) => {
    const req = superagent
      .del(`${API_BASE_URL}${url}`)
      .use(tokenPlugin)

    if (config.responseType === 'blob') {
      req.responseType('blob')
    }

    return req
      .then(res => (config.responseType === 'blob' ? res.xhr.response : res.body))
      .catch(handleErrors)
  },
}

export default requests
