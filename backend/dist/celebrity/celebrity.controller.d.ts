import { CelebrityService } from './celebrity.service';
import { CreateCelebrityDto } from './dto/create-celebrity.dto';
import { UpdateCelebrityDto } from './dto/update-celebrity.dto';
import { SearchCelebrityDto } from './dto/search-celebrity.dto';
import { Response } from 'express';
export declare class CelebrityController {
    private readonly celebrityService;
    constructor(celebrityService: CelebrityService);
    create(createCelebrityDto: CreateCelebrityDto): Promise<import("./celebrity.entity").Celebrity>;
    findAll(): Promise<import("./celebrity.entity").Celebrity[]>;
    findOne(id: string): Promise<import("./celebrity.entity").Celebrity>;
    update(id: string, updateCelebrityDto: UpdateCelebrityDto): Promise<import("./celebrity.entity").Celebrity>;
    remove(id: string): Promise<void>;
    aiSearch(searchCelebrityDto: SearchCelebrityDto): Promise<any[]>;
    getCelebrityPdf(id: string, res: Response): Promise<void>;
    aiAutofill(name: string): Promise<any>;
    getCelebrityNews(id: string): Promise<any[]>;
    getGeneralCelebrityNews(): Promise<any[]>;
}
