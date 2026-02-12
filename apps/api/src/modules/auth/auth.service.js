"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const database_1 = require("@publicadis/database");
const prisma_service_1 = require("../../common/services/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async signup(input, tenantId) {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: input.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        // Hash password
        const passwordHash = await (0, database_1.hashPassword)(input.password);
        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: input.email,
                passwordHash,
                firstName: input.firstName,
                lastName: input.lastName,
                phone: input.phone,
                tenantId,
                role: 'USER',
                // Attribution if provided
                acquiredBy: input.acquiredBy,
                acquiredVia: input.acquiredVia,
                acquiredFrom: input.acquiredFrom,
            },
        });
        // Generate tokens
        const accessToken = this.generateAccessToken(user.id, user.email, user.role);
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
    async login(input) {
        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email: input.email },
        });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        // Verify password
        const isValid = await (0, database_1.verifyPassword)(input.password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        // Update last login
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        // Generate token
        const accessToken = this.generateAccessToken(user.id, user.email, user.role);
        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.passwordHash) {
            return null;
        }
        const isValid = await (0, database_1.verifyPassword)(password, user.passwordHash);
        if (!isValid) {
            return null;
        }
        const { passwordHash, ...result } = user;
        return result;
    }
    async validateUserById(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const { passwordHash, ...result } = user;
        return result;
    }
    generateAccessToken(userId, email, role) {
        const payload = { sub: userId, email, role };
        return this.jwtService.sign(payload);
    }
    async verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map