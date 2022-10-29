import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProduces,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards';
import { AuthWithoutPasswordDto, LoginDto, RegisterDto } from './dto';
import { isHttpException } from '@/common';

@ApiTags('auth')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthWithoutPasswordDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Operation failed',
  })
  async register(@Body() dto: RegisterDto): Promise<AuthWithoutPasswordDto> {
    const doesUserExist = await this.authService.doesUserExist(dto.email);

    if (doesUserExist) {
      throw new BadRequestException('User already exists');
    }

    const isPasswordCorrect = this.authService.confirmPassword(
      dto.password,
      dto.confirmPassword,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    const res = await this.authService.saveUser(dto);

    if (isHttpException(res)) {
      throw new InternalServerErrorException('Cannot register');
    }

    return res;
  }

  @Post('login')
  @ApiNotFoundResponse({
    description: 'User not found with the given email/username',
  })
  @ApiUnauthorizedResponse({
    description: 'Passwords do not match. Email or password is wrong',
  })
  @ApiInternalServerErrorResponse({
    description: 'Cannot process bearer token',
  })
  @ApiOkResponse({
    status: 200,
    description: 'User successfully logged in',
    headers: {
      authorization: {
        description: 'Bearer token',
      },
    },
  })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const result = await this.authService.findUserByEmail(dto.email);

    if (isHttpException(result)) {
      throw new UnauthorizedException('Email or password is wrong');
    }

    const doPasswordsMatch = await this.authService.doPasswordsMatch(
      dto.password,
      result.password,
    );

    if (!doPasswordsMatch) {
      throw new UnauthorizedException('Email or password is wrong');
    }

    const user = result.user;

    const payload = {
      email: user.email,
      id: user.id,
    };

    return res
      .cookie('jwt-token', this.authService.signJwtPaylod(payload), {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/',
      })
      .json({
        email: user.email,
        id: user.id,
      });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.setHeader('Set-Cookie', this.authService.cookieForLogout);
    return res.sendStatus(200);
  }
}
