import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, LoginInput, AuthResponse } from './dto/auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async signup(
    @Args('input') input: SignupInput,
    @Args('tenantId', { defaultValue: 'publicadis' }) tenantId: string,
  ): Promise<AuthResponse> {
    return this.authService.signup(input, tenantId);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input);
  }
}
