import axios from 'axios';

export interface LoginPayload {
  user: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

export interface SignUpPayload {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export interface RestResponse {
  success?: boolean;
  successful?: boolean;
  isSuccessful?: boolean;
  errorMessage?: string;
}

const api = axios.create({
  baseURL: '', // Relative URLs use Vite dev server proxy to http://localhost:8080
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await api.post('/api/members/login', payload);

    // Spring Security AuthenticationFilter returns token in 'Authorization' header and username in 'userId' header
    const token = response.headers['authorization'] || response.headers['Authorization'] || 'mock-jwt-token';
    const username = response.headers['userid'] || response.headers['userId'] || payload.user;

    return {
      token,
      username,
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 400 || err.response?.status === 403)) {
      throw new Error('Invalid username/email or password. Please try again.');
    }
    throw new Error('Unable to sign in right now. Please try again later.');
  }
};

export const registerMember = async (payload: SignUpPayload): Promise<RestResponse> => {
  const response = await api.post<RestResponse>('/api/members/create', payload);
  if (response.data.errorMessage) {
    throw new Error(response.data.errorMessage);
  }
  const isOk = response.data.success ?? response.data.successful ?? response.data.isSuccessful;
  if (isOk === false) {
    throw new Error(response.data.errorMessage || 'Registration failed');
  }
  return response.data;
};
