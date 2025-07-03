import { IsString, IsNotEmpty, IsOptional, IsUrl, IsInt, Min } from 'class-validator';

export class CreateCelebrityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsUrl()
  instagram?: string;

  @IsInt()
  @Min(1000)
  fanbase: number;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  setlist?: string;
} 