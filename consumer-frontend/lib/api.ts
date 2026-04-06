// API service for communicating with Consumer Backend

export interface FormInitiationResponse {
  sessionId: string;
}

export interface TransactionStatus {
  transaction_id: string;
  status: string;
  [key: string]: any;
}

export interface AuthResponse {
  token: string;
  message: string;
  user: UserProfile;
}

export interface UserProfile {
  _id: string;
  email: string;
  full_name?: string;
  mobile?: string;
  date_of_birth?: string;
  gender?: string;
  address?: {
    careOf?: string;
    houseNumber?: string;
    street?: string;
    locality?: string;
    landmark?: string;
    district?: string;
    state?: string;
    pincode?: string;
    postOffice?: string;
    subDistrict?: string;
  };
  pan?: string;
  masked_aadhaar?: string;
  user_type?: string;
  verified_by?: string;
  isAccountVerified?: boolean;
  email_verified?: string;
  isAadhaarSeeded?: string;
  createdAt?: string;
}

export interface SignupAddress {
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

export interface SignupPayload {
  email: string;
  password: string;
  full_name: string;
  mobile: string;
  date_of_birth: string;
  gender: string;
  address: SignupAddress;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001';

/**
 * Gets the stored JWT token from localStorage
 * @returns The JWT token or null if not found
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * Gets authorization headers with JWT token if available
 * @returns Headers object with Authorization header if token exists
 */
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Signs up a new user
 * @param payload - User registration data including required identity fields
 * @returns Promise with user data and JWT token
 * @throws Error if signup fails
 */
export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Signup failed');
  }

  const data = await response.json();
  
  // Store JWT token in localStorage and cookie (cookie needed for middleware auth checks)
  if (data.token) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authUser', JSON.stringify(data.user));
    document.cookie = `authToken=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
    window.dispatchEvent(new Event('storage'));
  }
  
  return data;
}

/**
 * Logs in a user
 * @param email - User email
 * @param password - User password
 * @returns Promise with user data and JWT token
 * @throws Error if login fails
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  
  // Store JWT token in localStorage and cookie (cookie needed for middleware auth checks)
  if (data.token) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authUser', JSON.stringify(data.user));
    document.cookie = `authToken=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
    window.dispatchEvent(new Event('storage'));
  }
  
  return data;
}

/**
 * Initiates a form session by calling the backend start-form endpoint
 * Maintains backward compatibility by delegating to startService('pan')
 * @returns Promise with form_url and transaction_id
 * @throws Error if the request fails
 */
export async function startForm(): Promise<FormInitiationResponse> {
  return startService('pan');
}

/**
 * Retrieves transaction status by calling the backend transaction endpoint
 * @param transactionId - The transaction ID to query
 * @returns Promise with transaction status information
 * @throws Error if the request fails
 */
export async function getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
  const response = await fetch(`${BACKEND_URL}/api/transaction/${transactionId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to get transaction status: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Initiates a service session by calling the backend service endpoint
 * @param serviceId - The unique identifier for the service
 * @returns Promise with form_url and transaction_id
 * @throws Error if the service is not found or the request fails
 */
export async function startService(endpoint: string): Promise<FormInitiationResponse> {
  const response = await fetch(`${BACKEND_URL}/api/initiate?endpoint=${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to start service: ${response.statusText}`);
  }

  const result = await response.json();
  
  // Extract data from the API response structure
  if (result.data) {
    return result.data;
  }
  
  return result;
}

/**
 * Logs out the current user by removing the stored JWT token
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    document.cookie = 'authToken=; path=/; max-age=0; SameSite=Lax';
  }
}

/**
 * Fetches the current user's full profile from the backend
 */
export async function getMe(): Promise<UserProfile> {
  const response = await fetch(`${BACKEND_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}
