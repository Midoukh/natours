/* eslint-disable */
import { showAlert } from './alert';
export const signup = async (email, name, password, passwordConfirm) => {
  const url = 'http://localhost:3000/api/v1/users/signup';
  const data = {
    email,
    name,
    password,
    passwordConfirm,
  };
  console.log(data);
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 'success') {
        showAlert('success', 'Account Created successfully');
        setTimeout(() => {
          location.assign('/me');
        }, 1500);
      } else if (data.status === 'fail') {
        showAlert('error', data.message);
      }
    })
    .catch((err) => console.log(err));
};
export const login = async (email, password) => {
  console.log('Calling this function');
  const url = 'http://localhost:3000/api/v1/users/login';
  const data = {
    email,
    password,
  };
  console.log(data);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 'success') {
        showAlert('success', 'Logged in successfully');
        setTimeout(() => {
          location.assign('/');
        }, 1500);
      } else if (data.status === 'fail') {
        showAlert('error', data.message);
      }
    });
};

export const resetPassword = async (email) => {
  const url = 'http://localhost:3000/api/v1/users/forgotPassword';
  const data = {
    email,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 'success') {
        showAlert('success', 'Check your email for reset link');
        setTimeout(() => {
          location.assign('/');
        }, 1500);
      } else if (data.status === 'fail') {
        showAlert('error', data.message);
      }
    });
};

export const logout = async () => {
  const url = 'http://localhost:3000/api/v1/users/logout';
  const res = await fetch(url, {
    method: 'GET',
  }).then((res) => res.json());
  console.log(res);
  if (res.status === 'success') {
    window.location.assign('/');
  }
};
