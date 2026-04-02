import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private platformAccessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async signup(email: string, password: string) {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
    });

    return {
      id: user._id,
      email: user.email,
      token,
      message: 'User registered successfully',
    };
  }

  async login(email: string, password: string) {
    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
    });

    return {
      id: user._id,
      email: user.email,
      token,
      message: 'Login successful',
    };
  }

  /**
   * Gets an access token for platform API authentication
   * Caches the token and refreshes it when expired
   * 
   * @returns {Promise<string>} Access token for platform API calls
   */
  async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.platformAccessToken && this.tokenExpiresAt > Date.now()) {
      return this.platformAccessToken;
    }

    try {
      // Get credentials from environment
      const clientId = this.configService.get<string>('CLIENT_ID');
      const clientSecret = this.configService.get<string>('CLIENT_SECRET');
      const platformBaseUrl = this.configService.get<string>('PLATFORM_BASE_URL');
console.log({platformBaseUrl,clientId,clientSecret})
      // Encode credentials as Basic Auth header
      const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      // Request new token from platform using Basic Auth + form-urlencoded
      const response = await firstValueFrom(
        this.httpService.post(
          `${platformBaseUrl}/v1/oauth/token`,
          'grant_type=client_credentials&scope=read:pan/apply,write:pan/apply',
          {
            headers: {
              'Authorization': `Basic ${credentials}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );
console.log({response},"****")
      // Cache the token and set expiration time
      this.platformAccessToken = response.data.access_token;
      this.tokenExpiresAt = Date.now() + (response.data.expires_in * 1000);

      return this.platformAccessToken;
    } catch (error) {
      console.error('Error getting platform access token:', error.message);
      throw new UnauthorizedException('Failed to obtain platform access token');
    }
  }
}