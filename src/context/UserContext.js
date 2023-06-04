import React, { useEffect, useState } from 'react';
import { getUserData } from '../utils/getUserData';
import { getPowerUser } from '../services/firestore/firebase';

const UserContext = React.createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [powerUser, setPowerUser] = useState();
  const [isPowerUser, setIsPowerUser] = useState(false);

  // TODO remake poweruser functionality
  useEffect(() => {
    getPowerUser().then((poweruser) => {
      setPowerUser(poweruser.email);
    });
    const currentUser = getUserData();

    if (currentUser.email === powerUser) setIsPowerUser(true);
    else setIsPowerUser(false);
  }, [powerUser]);

  const login = (user) => {
    setUser(user);
    window.localStorage.setItem('user', JSON.stringify(user));
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
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
