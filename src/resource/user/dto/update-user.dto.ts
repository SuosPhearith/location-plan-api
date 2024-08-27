import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}
