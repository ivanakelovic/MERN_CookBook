import React,{
    FC,
    useState,
    useEffect,
    createContext,
    useContext,
    useRef,
    Dispatch,
    SetStateAction,
} from 'react'
import {LayoutSplashScreen} from "../layouts/LayoutSplashScreen";
import {AuthModel, UserModel} from './_models'
import * as authHelper from './AuthHelpers'
import {WithChildren} from "../helpers/migrationHelper";
import AuthService from "../services/api-client/auth.service";
type AuthContextProps = {
    auth: AuthModel | undefined
    saveAuth: (auth: AuthModel | undefined) => void
    currentUser: UserModel | undefined
    setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
    logout: () => void
}
const initAuthContextPropsState = {
    auth: authHelper.getAuth(),
    saveAuth: () => {},
    currentUser: undefined,
    setCurrentUser: () => {},
    logout: () => {},
}
const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)
const authService = new AuthService();
const useAuth = () => {
    return useContext(AuthContext)
}
const AuthProvider: FC<WithChildren> = ({children}) => {
    const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
    const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
    const saveAuth = (auth: AuthModel | undefined) => {
        setAuth(auth)
        if (auth) {
            authHelper.setAuth(auth)
        } else {
            authHelper.removeAuth()
        }
    }
    const logout = async () => {
        saveAuth(undefined)
        setCurrentUser(undefined)
        if(auth && auth.refresh) {
            await authService.logout(auth.refresh.token);
        }
    }
    return (
        <AuthContext.Provider value={{auth, saveAuth, currentUser, setCurrentUser, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
const AuthInit: FC<WithChildren> = ({children}) => {
    const {auth, logout, setCurrentUser} = useAuth()
    const didRequest = useRef(false)
    const [showSplashScreen, setShowSplashScreen] = useState(true)
    // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
    useEffect(() => {
        const requestUser = async (access: string) => {
            try {
                if (!didRequest.current) {
                    const user = await authService.getUser()
                    if (user) {
                        setCurrentUser(user)
                    }
                }
            } catch (error) {
                console.error(error)
                if (!didRequest.current) {
                    logout()
                }
            } finally {
                setShowSplashScreen(false)
            }
            return () => (didRequest.current = true)
        }
        if (auth && auth.access) {
            requestUser(auth.access.token)
        } else {
            logout()
            setShowSplashScreen(false)
        }
        // eslint-disable-next-line
    }, [])
    return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}
export {AuthProvider, AuthInit, useAuth}







