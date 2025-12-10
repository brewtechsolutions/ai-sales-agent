import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.prisma.adminUser.findUnique({
        where: { email },
      });

      if (user && await bcrypt.compare(password, user.password)) {
        const { password: _, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      this.logger.error('Error validating user:', error);
      return null;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async createAdminUser(userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await this.prisma.adminUser.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role || 'admin',
        },
      });

      this.logger.log(`Created admin user: ${user.id}`);
      return { id: user.id, email: user.email, name: user.name, role: user.role };
    } catch (error) {
      this.logger.error('Error creating admin user:', error);
      throw error;
    }
  }
}
