import { Controller, Post, Get, Param, HttpException, HttpStatus, Query, UseGuards, Request, Body } from '@nestjs/common';
import { FormService, FormInitiationResponse, TransactionStatus } from './form/form.service';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';

@Controller('api')
export class AppController {
  constructor(
    private readonly formService: FormService,
    private readonly authService: AuthService,
  ) {}

  @Post('/initiate')
  async startForm(@Query('endpoint') endpoint: string): Promise<FormInitiationResponse> {
    try {
      return await this.formService.initiateForm(endpoint);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Initiates a service session and returns an encrypted user profile payload.
   * Encryption happens server-side using the platform's RSA public key.
   * The frontend uses the returned encryptedProfile to build the redirect URL.
   */
  @UseGuards(AuthGuard)
  @Post('/initiate-redirect')
  async initiateRedirect(
    @Query('endpoint') endpoint: string,
    @Request() req: any,
    @Body() body: { email?: string },
  ): Promise<{ sessionId: string; encryptedProfile: string }> {
    try {
      const userProfile = await this.authService.getMe(req.user.userId);
      const email = userProfile.email || body.email || '';
      const { sessionId } = await this.formService.initiateForm(endpoint, email);
      const encryptedProfile = this.formService.encryptUserProfile(userProfile);

      return { sessionId, encryptedProfile };
    } catch (error) {
      console.error('[initiate-redirect] error:', error?.message);
      console.error('[initiate-redirect] detail:', error?.response?.data ?? error);
      throw new HttpException(
        error?.response?.data?.message ?? error?.message ?? 'Internal Server Error',
        error?.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('transaction/:id')
  async getTransactionStatus(@Param('id') id: string): Promise<TransactionStatus> {
    try {
      return await this.formService.getTransactionStatus(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status >= 400 && status < 500) {
        throw new HttpException(error.response.data || 'Client error', status);
      }
      if (status >= 500) {
        throw new HttpException('Bad Gateway', HttpStatus.BAD_GATEWAY);
      }
    }
    throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
