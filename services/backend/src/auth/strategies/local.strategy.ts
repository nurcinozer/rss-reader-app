import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Auth } from '@prisma/client';
import { isHttpException } from '@/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Auth> {
    const res = await this.authService.findUserByEmail(email);

    if (isHttpException(res)) {
      throw res;
    }

    const match = await this.authService.doPasswordsMatch(
      password,
      res.password,
    );

    if (!match) {
      throw new UnauthorizedException();
    }

    return res;
  }
}
