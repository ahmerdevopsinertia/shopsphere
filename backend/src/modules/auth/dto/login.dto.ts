import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty} from 'class-validator';

export class LoginDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}