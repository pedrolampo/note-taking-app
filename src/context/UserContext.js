import React, { useState } from 'react';
import { getPowerUser } from '../services/firestore/firebase';

const UserContext = React.createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isPowerUser, setIsPowerUser] = useState(false);

  const login = (user) => {
    getPowerUser().then((poweruser) => {
      setIsPowerUser(poweruser);
    });

    setUser(user);
    window.localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser();
    window.localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isPowerUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
