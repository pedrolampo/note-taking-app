import React, { useState } from 'react';
import { searchUsers } from '../services/firestore/firebase';
const UserContext = React.createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isPowerUser, setIsPowerUser] = useState(false);

  const login = async (user) => {
    setUser(user);

    let userData = await searchUsers().then((data) => {
      return data.find((el) => el.uid === user.uid);
    });

    const safeUser = {
      email: user.email,
      uid: user.uid,
      name: userData.name,
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
