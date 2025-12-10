import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';

@ApiTags('Auth')
@Controller('api/auth')
@UseGuards(OptionalAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginData: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginData.email, loginData.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return await this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Create admin user' })
  @ApiResponse({ status: 201, description: 'Admin user created successfully' })
  async register(@Body() userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) {
    return await this.authService.createAdminUser(userData);
  }
}
