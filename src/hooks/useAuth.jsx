import React from 'react';

import AuthContext from '../contexts/auth/auth-context';

const useAuth = () => {
  const { user } = React.useContext(AuthContext);

  return { user };
};

export default useAuth;
