const jsonData = require('../config.json');
// FIXME: get this to work
export const apiCall = (path, method, body) => {
  return new Promise((resolve, reject) => {
    // Strip path of leading '/' maybe
    // path.replace(/^\//, '');
    fetch(`http://127.0.0.1:${jsonData.BACKEND_PORT}/${path}`, {
      method: method,
      
      headers: {
        // 'content-type': 'application/json',
        authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined,

      },
      body: method === 'GET' ? undefined : JSON.stringify(body)
    }).then((response) => {
      if (response.ok) {
        // Should work
        return response.json().then(resolve);
        
        // else if 401, user is unknown, redirect to login?
        // else if 403, user is forbidden
      } else {
        try {
          return response.json().then(obj => {
            console.log(obj);
            alert(obj.error);
            reject(obj.error);
          })
        } catch (error) {
          console.log(error);
        }
        
      }
    })
  });
}

export default apiCall;