export declare class SignupInput {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    acquiredBy?: string;
    acquiredVia?: string;
    acquiredFrom?: string;
}
export declare class LoginInput {
    email: string;
    password: string;
}
export declare class UserPayload {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
}
export declare class AuthResponse {
    accessToken: string;
    user: UserPayload;
}
//# sourceMappingURL=auth.dto.d.ts.map