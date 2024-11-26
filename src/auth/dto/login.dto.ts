import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  key: string;
  @IsString()
  password: string;
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}
