import { Repository } from 'typeorm';
import { Celebrity } from './celebrity.entity';
import { CreateCelebrityDto } from './dto/create-celebrity.dto';
import { UpdateCelebrityDto } from './dto/update-celebrity.dto';
import { SearchCelebrityDto } from './dto/search-celebrity.dto';
import { ConfigService } from '@nestjs/config';
export declare class CelebrityService {
    private readonly celebrityRepository;
    private readonly configService;
    private gemini;
    constructor(celebrityRepository: Repository<Celebrity>, configService: ConfigService);
    create(createCelebrityDto: CreateCelebrityDto): Promise<Celebrity>;
    findAll(): Promise<Celebrity[]>;
    findOne(id: number): Promise<Celebrity>;
    update(id: number, updateCelebrityDto: UpdateCelebrityDto): Promise<Celebrity>;
    remove(id: number): Promise<void>;
    aiSearch(searchCelebrityDto: SearchCelebrityDto): Promise<any[]>;
    generatePdf(id: number): Promise<Buffer>;
    aiAutofill(name: string): Promise<any>;
    getCelebrityNews(name: string): Promise<any[]>;
}
