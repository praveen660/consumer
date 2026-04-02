import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';

/**
 * Response interface for form initiation requests
 * Contains the session ID returned by the form platform
 */
export interface FormInitiationResponse {
  sessionId: string;
}

/**
 * Response interface for transaction status queries
 * Contains transaction details and status information
 */
export interface TransactionStatus {
  transaction_id: string;
  status: string;
  [key: string]: any; // Allows additional dynamic properties
}

/**
 * FormService handles form-related operations for the consumer backend
 * Manages form initiation and transaction status tracking
 * 
 * Dependencies:
 * - HttpService: For making HTTP requests to the form platform
 * - AuthService: For obtaining access tokens for authenticated requests
 * - ConfigService: For accessing environment configuration values
 */
@Injectable()
export class FormService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Initiates a form submission by calling the form platform API
   * 
   * Process:
   * 1. Retrieves the form platform backend URL from configuration
   * 2. Obtains an access token from the auth service
   * 3. Makes a POST request to the form platform's initiate endpoint
   * 4. Sends form ID and user reference in the request body
   * 5. Includes authorization header with the access token
   * 
   * @returns {Promise<FormInitiationResponse>} Response containing the session ID
   * @throws {Error} If the API call fails or authentication fails
   */
  async initiateForm(endpoint:string): Promise<FormInitiationResponse> {
    try {
      // Retrieve the form platform backend URL from environment configuration
      const formPlatformBackendBaseUrl = this.configService.get<string>('FORM_PLATFORM_BACKEND_BASE_URL');
      // Get the access token for authenticating the request
      const accessToken = await this.authService.getAccessToken();
      
      // Construct the full URL for the form initiation endpoint
      const url = `${formPlatformBackendBaseUrl}/api/forms/initiate`;
      console.log({endpoint})

      // Make the HTTP POST request to initiate the form
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            // Form ID for the PAN application form
            formId: endpoint,
            // User reference identifier for tracking
            userReference: 'test_user',
          },
          {
            headers: {
              // Include bearer token for authentication
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      // Log the response for debugging purposes
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);
      
      // Return the response data containing the session ID
      return response.data;
    } catch (error) {
      // Log error details for debugging
      console.error('Error in initiateForm:', error.message);
      console.error('Error Details:', error.response?.data || error);
      // Re-throw the error to be handled by the caller
      throw error;
    }
  }

  /**
   * Retrieves the current status of a transaction
   * 
   * Current Implementation:
   * - Returns a dummy/mock response for testing purposes
   * - Does not make actual API calls to the platform
   * 
   * TODO: Replace with real platform API call when ready
   * The commented code below shows the intended implementation:
   * - Fetch the platform base URL from configuration
   * - Get an access token from the auth service
   * - Make a GET request to the platform's transaction status endpoint
   * - Return the actual transaction status from the platform
   * 
   * @param {string} transactionId - The ID of the transaction to check
   * @returns {Promise<TransactionStatus>} Mock transaction status object
   */
  async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    // TODO: Implement real platform API call
    // const platformBaseUrl = this.configService.get<string>('PLATFORM_BASE_URL');
    // const accessToken = await this.authService.getAccessToken();

    // const response = await firstValueFrom(
    //   this.httpService.get(
    //     `${platformBaseUrl}/forms/transactions/${transactionId}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     },
    //   ),
    // );

    // return response.data;

    // Return a dummy response for testing - replace with real API call above
    return {
      transaction_id: transactionId,
      status: 'completed',
      form_id: 'pan_application',
      submitted_at: new Date().toISOString(),
    };
  }
}
