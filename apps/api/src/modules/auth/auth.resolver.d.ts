import { AuthService } from './auth.service';
import { SignupInput, LoginInput, AuthResponse } from './dto/auth.dto';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    signup(input: SignupInput, tenantId: string): Promise<AuthResponse>;
    login(input: LoginInput): Promise<AuthResponse>;
}
//# sourceMappingURL=auth.resolver.d.ts.map