import React, {createContext } from 'react';

export const AuthContext = createContext({
    existSession : false,
    setExistSession : () => {},
});
export const AuthProvider = AuthContext.Provider;
export const AuthConsumer = AuthContext.Consumer;
