import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

interface AddressDto {
  careOf?: string;
  houseNumber?: string;
  street?: string;
  locality?: string;
  landmark?: string;
  district: string;
  state: string;
  pincode: string;
  postOffice?: string;
  subDistrict?: string;
}

interface SignupDto {
  email: string;
  password: string;
  full_name: string;
  mobile: string;
  date_of_birth: string;
  gender: string;
  address: AddressDto;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Request() req: any) {
    return this.authService.getMe(req.user.userId);
  }
}
