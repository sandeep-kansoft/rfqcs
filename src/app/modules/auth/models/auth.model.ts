export class AuthModel {
  // authToken: string;
  // refreshToken: string;
  // expiresIn: Date;

  accessToken: string;
  expireInSeconds: number;
  shouldResetPassword: boolean;
  userId: number;
  userRole: string;
  refreshToken: string;
  refreshTokenExpireInSeconds: number;
  isAzureLogin: boolean

  setAuth(auth: AuthModel) {
    this.accessToken = auth.accessToken;
    this.expireInSeconds = auth.expireInSeconds;
    this.shouldResetPassword = auth.shouldResetPassword;
    this.userId = auth.userId;
    this.userRole = auth.userRole;
    this.refreshToken = auth.refreshToken;
    this.refreshTokenExpireInSeconds = auth.refreshTokenExpireInSeconds;
    this.isAzureLogin = auth.isAzureLogin
  }
}
