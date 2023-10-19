import React, { useState } from 'react';
const UserContext = React.createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isPowerUser, setIsPowerUser] = useState(false);

  const login = (user) => {
    setUser(user);

    const safeUser = {
      email: window.btoa(user.email),
      uid: window.btoa(user.uid),
      accessToken: window.btoa(user.accessToken),
    };

    window.localStorage.setItem('user', JSON.stringify(safeUser));
  };

  const logout = () => {
    setUser();
    setIsPowerUser(false);
    window.localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isPowerUser,
    setIsPowerUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
