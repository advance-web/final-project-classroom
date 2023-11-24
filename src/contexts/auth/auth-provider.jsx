import { useState } from 'react';
import PropTypes from 'prop-types';

import AuthContext from './auth-context';

const AuthProvider = (props) => {
  const [user, setUser] = useState(null);

  return <AuthContext.Provider value={{ user, setUser }}>{props.children}</AuthContext.Provider>;
};
AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
