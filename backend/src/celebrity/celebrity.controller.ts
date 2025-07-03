import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Res } from '@nestjs/common';
import { CelebrityService } from './celebrity.service';
import { CreateCelebrityDto } from './dto/create-celebrity.dto';
import { UpdateCelebrityDto } from './dto/update-celebrity.dto';
import { SearchCelebrityDto } from './dto/search-celebrity.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('celebrities')
export class CelebrityController {
  constructor(private readonly celebrityService: CelebrityService) {}

  @Post()
  create(@Body() createCelebrityDto: CreateCelebrityDto) {
    return this.celebrityService.create(createCelebrityDto);
  }

  @Get()
  findAll() {
    return this.celebrityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.celebrityService.findOne(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCelebrityDto: UpdateCelebrityDto,
  ) {
    return this.celebrityService.update(Number(id), updateCelebrityDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.celebrityService.remove(Number(id));
  }

  @Post('search')
  async aiSearch(@Body() searchCelebrityDto: SearchCelebrityDto) {
    const aiResults = await this.celebrityService.aiSearch(searchCelebrityDto);
    const allCelebs = await this.celebrityService.findAll();
    // Improved matching: trim, lowercase, and partial match
    const resultsWithId = aiResults.map((ai: any) => {
      const aiName = ai.name.trim().toLowerCase();
      const match = allCelebs.find(
        c => c.name.trim().toLowerCase() === aiName ||
             c.name.trim().toLowerCase().includes(aiName) ||
             aiName.includes(c.name.trim().toLowerCase())
      );
      return match ? { ...ai, id: match.id } : ai;
    });
    return resultsWithId;
  }

  @Get(':id/pdf')
  async getCelebrityPdf(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.celebrityService.generatePdf(Number(id));
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=celebrity-${id}.pdf`,
    });
    res.send(pdfBuffer);
  }

  @Post('ai-autofill')
  async aiAutofill(@Body('name') name: string) {
    return this.celebrityService.aiAutofill(name);
  }

  @Get(':id/news')
  async getCelebrityNews(@Param('id') id: string) {
    const celeb = await this.celebrityService.findOne(Number(id));
    if (!celeb) return [];
    return this.celebrityService.getCelebrityNews(celeb.name);
  }

  @Get('news')
  async getGeneralCelebrityNews() {
    // Use a generic query for general celebrity news
    return this.celebrityService.getCelebrityNews('celebrity OR celebrities');
  }
} 