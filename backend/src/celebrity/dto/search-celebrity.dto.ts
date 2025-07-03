import { IsString, IsNotEmpty } from 'class-validator';

export class SearchCelebrityDto {
  @IsString()
  @IsNotEmpty()
  query: string;
} 