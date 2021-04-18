const BASE_URL = 'https://register.nomoreparties.co';

module.exports.register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      Acccept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => {
    return res.json();
  });
};

module.exports.authorize = (identifier, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      Acccept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: identifier, password: password }),
  })
    .then((res) => {
      console.log(res)
      return res.json();
    })
    .then((data) => {
      if (!data.message) {
        localStorage.setItem('token', data.token);
        return data;
      }
    });
};

module.exports.getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    console.log(res)
    return res.ok
      ? res.json()
      : Promise.reject(`${res.status} - ${res.message}`);
  })
  .then((data) => {
    console.log(data);
    return data
  })
  .catch((err) => console.log(err))
};