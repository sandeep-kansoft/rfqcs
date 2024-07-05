export class LoginRequestDto {
  UserNameOrEmailAddress: string;
  Password: string;
  SingleSignIn: boolean;
  AzureToken: string;
  DirectLogin:boolean;
}
