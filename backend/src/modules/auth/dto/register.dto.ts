import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(24)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
    {
      message:
        'Password must contain uppercase, lowercase and number',
    },
  )
  password: string;
}