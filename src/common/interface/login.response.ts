export interface LoginResponse<T> {
  user: T;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
