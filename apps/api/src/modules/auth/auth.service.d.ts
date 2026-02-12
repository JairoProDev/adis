import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/common/services/prisma.service';
import { SignupInput, LoginInput, AuthResponse } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signup(input: SignupInput, tenantId: string): Promise<AuthResponse>;
    login(input: LoginInput): Promise<AuthResponse>;
    validateUser(email: string, password: string): Promise<any>;
    validateUserById(userId: string): Promise<any>;
    private generateAccessToken;
    verifyToken(token: string): Promise<any>;
}
//# sourceMappingURL=auth.service.d.ts.map