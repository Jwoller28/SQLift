import { createContext, ReactNode, useReducer } from "react";

interface User{
    username: string;
    password: string;
}

interface AuthState{
    user: User | null;
}

type AuthAction = {type: 'LOGIN'; payload: User} | {type: 'LOGOUT'};

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

// Provider component

interface AuthProviderProps{
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    return(
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}