function asyncRequest(url, { handleSuccess, handleError, redirect }) {
  // Relying on this CORS bypass server to proxy the request to the heroku app (ironically hosted on heroku)
  const CORS_BYPASS_SERVER = 'https://cors-anywhere.herokuapp.com/';

  const controller = new AbortController();
  const { signal } = controller;

  const statusIs200 = statusIs(200);
  //Check bypass server is working
  fetch(CORS_BYPASS_SERVER, { signal })
    .then(statusIs200)
    .catch((error) => handleError('CORS_BYPASS_SERVER ERROR', error))
    .then(() => fetch(`${CORS_BYPASS_SERVER}${url}`, { signal }))
    .then(statusIs200)
    .then((response) => {
      if (redirect) window.location.href = url;
      handleSuccess(response);
    })
    .catch((error) => handleError('URL ERROR', error));

  return controller;
}

const statusIs = (code) => (response) =>
  response.status === code
    ? Promise.resolve(response)
    : Promise.reject(response);

//module.exports = herokuSpinup;
