import { Controller, Get, Post, Param, HttpException, HttpStatus, Query } from '@nestjs/common';
import { FormService, FormInitiationResponse, TransactionStatus } from './form/form.service';

@Controller('api')
export class AppController {
  constructor(private readonly formService: FormService) {}

@Post('/initiate')
async startForm(
  @Query('endpoint') endpoint: string
): Promise<FormInitiationResponse> {
  try {
    return await this.formService.initiateForm(endpoint);
  } catch (error) {
    throw this.handleError(error);
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
        throw new HttpException(
          error.response.data || 'Client error',
          status,
        );
      }
      if (status >= 500) {
        throw new HttpException('Bad Gateway', HttpStatus.BAD_GATEWAY);
      }
    }
    throw new HttpException(
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
