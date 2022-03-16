import React, { createContext, useReducer } from "react";

const AuthContext = createContext();
const initialState = {};

function authReducer(state, action) {
  switch (action.type) {
    case "login": {
      return {
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
        ...state,
      };
    }
    case "logout": {
      return initialState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const value = { state, dispatch };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useLogin() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useLogin must be used within a AuthProvider");
  }
  return context;
}

export default { AuthProvider, useLogin };
