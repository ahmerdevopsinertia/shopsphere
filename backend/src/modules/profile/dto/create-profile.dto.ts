import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional} from 'class-validator';

export class CreateProfileDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  firstName: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  lastName: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  phone?: string;
}