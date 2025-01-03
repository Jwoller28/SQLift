<<<<<<< HEAD
import { createContext, ReactNode, useContext, useReducer, useState } from "react";

interface AuthContextType{
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

export interface User{
=======
import { createContext, ReactNode, useReducer } from "react";

interface User{
>>>>>>> ebbd7023a (Reorganized files)
    username: string;
    password: string;
}

<<<<<<< HEAD
interface UserContextType{
    user: User | null;
    login: (username: string, password: string) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const login = (username: string, password: string) => {
        setUser({username, password});
    }

    const logout = () => {
        setUser(null);
    }
    return (
        <UserContext.Provider value={{user, login, logout}}>
            {children}
        </UserContext.Provider>
    )
=======
interface AuthState{
    user: User | null;
>>>>>>> ebbd7023a (Reorganized files)
}

type AuthAction = {type: 'LOGIN'; payload: User} | {type: 'LOGOUT'};

<<<<<<< HEAD
// const authReducer = (state: AuthState, action: AuthAction): AuthState =>{
//     switch(action.type){
//         case 'LOGIN':   // Get API call of user being logged in
//             return {user: action.payload};
//         case 'LOGOUT':
//             return {user: null};
//         default:
//             throw new Error(`Unhandled action type: ${(action as AuthAction).type}`);
//     }
// }


// context type
// interface AuthContextType{
//     // state: AuthState;
//     // dispatch: React.Dispatch<AuthAction>;
    
    
// }

export const AuthContext = createContext<AuthContextType | null> (null);

// const initialAuthState: AuthState = {user: null};
=======
const authReducer = (state: AuthState, action: AuthAction): AuthState =>{
    switch(action.type){
        case 'LOGIN':   // Get API call of user being logged in
            return {user: action.payload};
        case 'LOGOUT':
            return {user: null};
        default:
            throw new Error(`Unhandled action type: ${(action as AuthAction).type}`);
    }
}


// context type
interface AuthContextType{
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextType | undefined> (undefined);

const initialAuthState: AuthState = {user: null};
>>>>>>> ebbd7023a (Reorganized files)

// Provider component

interface AuthProviderProps{
    children: ReactNode;
}

<<<<<<< HEAD

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout}}>
=======
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    return(
        <AuthContext.Provider value={{state, dispatch}}>
>>>>>>> ebbd7023a (Reorganized files)
            {children}
        </AuthContext.Provider>
    )
}
<<<<<<< HEAD

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
//     const [state, dispatch] = useReducer(authReducer, initialAuthState);

//     return(
//         <AuthContext.Provider value={{state, dispatch}}>
//             {children}
//         </AuthContext.Provider>
//     )
// }
=======
>>>>>>> ebbd7023a (Reorganized files)
