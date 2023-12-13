import axios from "axios";
import jwtDecode from "jwt-decode";
import {LoginResponse} from "../../interfaces/login-response.interface";
import {UserModel} from "../../models/user.model";
import {LogoutResponse} from "../../interfaces/logout-response.interface";
import {getUser} from "../user.service";
import {RegisterResponse} from "../../interfaces/register-response.interface";

const API_URL = process.env.REACT_APP_API_URL;
const API_VERSION = process.env.REACT_APP_API_VERSION;

class AuthService {

    async resetPassword(password: string, token: string): Promise<any> {
        try {
            await axios.post(`${API_URL}/${API_VERSION}/auth/reset-password?token=${token}`, { password });
            return {data: {result: true}};
        } catch (error) {
            console.error("Resetting password failed:", error);
            return null;
        }
    }

    // Login user and retrieve JWT token
    async login(email: string, password: string): Promise<LoginResponse | null> {
        try {
            console.log('authservice: ',email);
            console.log("response",await axios.post<LoginResponse>(`${API_URL}/${API_VERSION}/auth/login`,
                {email, password}));
            const response = await axios.post<LoginResponse>(`${API_URL}/${API_VERSION}/auth/login`,
                {email, password});
            this.saveToken(response.data.tokens.access.token);
            return response.data;
        } catch (error) {
            console.error("Login failed:", error);
            return null;
        }
    }

    async register(email: string, firstName: string, lastName: string, password: string): Promise<RegisterResponse | null> {
        try {
            const response = await axios.post<RegisterResponse>(`${API_URL}/${API_VERSION}/auth/register`, {
                email,
                firstName,
                lastName,
                password
            })
            this.saveToken(response.data.tokens.access.token);
            return response.data;
        } catch (error) {
            console.error("Registration failed:", error);
            return null;
        }
    }


    async forgotPassword(email: string): Promise<any> {
        try {
            await axios.post(`${API_URL}/${API_VERSION}/auth/forgot-password`, {email});

        } catch (error) {
            console.error("Mail not send :", error);
            return null;
        }
    }

    // Logout user and retrieve JWT token
    async logout(refreshToken: string): Promise<LogoutResponse | null> {
        try {
            const response = await axios.post<LogoutResponse>(`${API_URL}/${API_VERSION}/auth/logout`, {refreshToken});
            this.removeToken();
            return response.data;
        } catch (error) {
            console.error("Logout failed:", error);
            return null;
        }
    }

    // Save the JWT token in localStorage
    saveToken(token: string): void {
        localStorage.setItem("token", token);
    }

    // Retrieve the JWT token from localStorage
    getToken(): string | null {
        return localStorage.getItem("token");
    }

    // Remove the JWT token from localStorage
    removeToken(): void {
        localStorage.removeItem("token");
    }

    // // Check if the user is logged in
    // isLoggedIn(): boolean {
    //   const token = this.getToken();
    //   return token !== null;
    // }
    // Decode the JWT token and retrieve the user information
    async getUser(): Promise<UserModel | null> {
        const token = this.getToken();
        if (token) {
            const decoded: any = jwtDecode(token);
            const user = await getUser(decoded.sub);
            return user;
        }
        return null;
    }


    async sendVerificationEmail(): Promise<any> {
        try {
            const token = this.getToken();
            if (token) {
                const response = await axios.post(`${API_URL}/${API_VERSION}/auth/send-verification-email`, {
                    token
                });
                return response.data
            } else {
                throw new Error("No token found!");
            }

        } catch (error) {
            console.error("Sending verification email failed:", error);
        }
    }

    async verifyEmail(token: string): Promise<boolean> {
        try {
            console.log("Token being sent:", token);
            const response = await axios.post(`${API_URL}/${API_VERSION}/auth/verify-email`, {
                token
            });
            if (response.status === 204)
                return true;
            else
                return false;

        } catch (error) {
            console.error("Email verification failed:", error);
            return false;
        }
    }


}

export default AuthService;