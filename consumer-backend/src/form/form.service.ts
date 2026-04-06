import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

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
  async initiateForm(endpoint: string, email = ''): Promise<FormInitiationResponse> {
    try {
      const formPlatformBackendBaseUrl = this.configService.get<string>('FORM_PLATFORM_BACKEND_BASE_URL');
      const accessToken = await this.authService.getAccessToken();
      const url = `${formPlatformBackendBaseUrl}/api/forms/initiate`;

      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            formId: endpoint,
            userReference: email || 'test_user',
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      console.log('Response Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data));

      const data = response.data?.data ?? response.data;
      const sessionId = data.sessionId ?? data.session_id ?? data.id ?? data.token ?? data.sessionToken;

      if (!sessionId) {
        throw new Error(`sessionId not found in platform response: ${JSON.stringify(data)}`);
      }

      return { sessionId };
    } catch (error) {
      console.error('Error in initiateForm:', error.message);
      console.error('Error Details:', error.response?.data || error);
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
  /**
   * Encrypts user profile data with the platform's RSA public key (server-side only).
   * Uses RSA-OAEP with SHA-256. Returns a base64url-encoded encrypted string.
   *
   * @param userProfile - The user profile object to encrypt
   * @returns base64url-encoded encrypted payload
   */
  encryptUserProfile(userProfile: object): string {
    let pemKey = this.configService.get<string>('PLATFORM_PUBLIC_KEY');
    if (!pemKey) throw new Error('PLATFORM_PUBLIC_KEY is not configured');

    // Normalize: replace literal \n with real newlines
    pemKey = pemKey.replace(/\\n/g, '\n');

    // If key has no newlines (single-line PEM), reconstruct proper PEM format
    if (!pemKey.includes('\n')) {
      const base64 = pemKey
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .trim();
      const wrapped = base64.match(/.{1,64}/g)?.join('\n') ?? base64;
      pemKey = `-----BEGIN PUBLIC KEY-----\n${wrapped}\n-----END PUBLIC KEY-----`;
    }

    // Hybrid encryption: AES-256-GCM for data + RSA-OAEP for AES key
    // RSA can only encrypt ~214 bytes directly, so we encrypt the data with AES
    // and encrypt the AES key with RSA.

    // 1. Generate a random 256-bit AES key and 96-bit IV
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);

    // 2. Encrypt the payload with AES-256-GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
    const payload = Buffer.from(JSON.stringify(userProfile));
    const encryptedData = Buffer.concat([cipher.update(payload), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // 3. Encrypt the AES key with RSA-OAEP
    const encryptedKey = crypto.publicEncrypt(
      { key: pemKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
      aesKey,
    );

    // 4. Bundle everything together as JSON, then base64url encode
    const bundle = {
      encryptedKey: encryptedKey.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      encryptedData: encryptedData.toString('base64'),
    };

    return Buffer.from(JSON.stringify(bundle)).toString('base64url');
  }

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
