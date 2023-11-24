export const getJwt = () => {
  return localStorage.getItem('jwt');
};

export const setJwt = (token) => {
  localStorage.setItem('jwt', token);
};
