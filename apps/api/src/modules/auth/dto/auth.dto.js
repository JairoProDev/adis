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
exports.AuthResponse = exports.UserPayload = exports.LoginInput = exports.SignupInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let SignupInput = class SignupInput {
};
exports.SignupInput = SignupInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SignupInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], SignupInput.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupInput.prototype, "firstName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignupInput.prototype, "lastName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignupInput.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignupInput.prototype, "acquiredBy", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignupInput.prototype, "acquiredVia", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignupInput.prototype, "acquiredFrom", void 0);
exports.SignupInput = SignupInput = __decorate([
    (0, graphql_1.InputType)()
], SignupInput);
let LoginInput = class LoginInput {
};
exports.LoginInput = LoginInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
exports.LoginInput = LoginInput = __decorate([
    (0, graphql_1.InputType)()
], LoginInput);
let UserPayload = class UserPayload {
};
exports.UserPayload = UserPayload;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserPayload.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserPayload.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UserPayload.prototype, "firstName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UserPayload.prototype, "lastName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserPayload.prototype, "role", void 0);
exports.UserPayload = UserPayload = __decorate([
    (0, graphql_1.ObjectType)()
], UserPayload);
let AuthResponse = class AuthResponse {
};
exports.AuthResponse = AuthResponse;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthResponse.prototype, "accessToken", void 0);
__decorate([
    (0, graphql_1.Field)(() => UserPayload),
    __metadata("design:type", UserPayload)
], AuthResponse.prototype, "user", void 0);
exports.AuthResponse = AuthResponse = __decorate([
    (0, graphql_1.ObjectType)()
], AuthResponse);
//# sourceMappingURL=auth.dto.js.map