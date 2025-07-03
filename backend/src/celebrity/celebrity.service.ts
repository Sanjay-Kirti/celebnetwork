import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Celebrity } from './celebrity.entity';
import { CreateCelebrityDto } from './dto/create-celebrity.dto';
import { UpdateCelebrityDto } from './dto/update-celebrity.dto';
import { SearchCelebrityDto } from './dto/search-celebrity.dto';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as puppeteer from 'puppeteer';
import axios from 'axios';

@Injectable()
export class CelebrityService {
  private gemini: GoogleGenerativeAI;

  constructor(
    @InjectRepository(Celebrity)
    private readonly celebrityRepository: Repository<Celebrity>,
    private readonly configService: ConfigService,
  ) {
    const geminiApiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set in the environment variables');
    }
    this.gemini = new GoogleGenerativeAI(geminiApiKey);
  }

  async create(createCelebrityDto: CreateCelebrityDto): Promise<Celebrity> {
    const celebrity = this.celebrityRepository.create(createCelebrityDto);
    return this.celebrityRepository.save(celebrity);
  }

  async findAll(): Promise<Celebrity[]> {
    return this.celebrityRepository.find();
  }

  async findOne(id: number): Promise<Celebrity> {
    const celebrity = await this.celebrityRepository.findOneBy({ id });
    if (!celebrity) {
      throw new NotFoundException('Celebrity not found');
    }
    return celebrity;
  }

  async update(id: number, updateCelebrityDto: UpdateCelebrityDto): Promise<Celebrity> {
    await this.celebrityRepository.update(id, updateCelebrityDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.celebrityRepository.delete(id);
  }

  async aiSearch(searchCelebrityDto: SearchCelebrityDto): Promise<any[]> {
    const prompt = `
Given the following user query, suggest a list of 3-5 global performing celebrities that match.\nReturn ONLY a valid JSON array, where each item has \'name\' and \'photoUrl\' fields. Do not include any explanation or text outside the JSON array.\nQuery: ${searchCelebrityDto.query}
    `;
    try {
      const model = this.gemini.getGenerativeModel({ model: 'models/gemini-1.5-pro-latest' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log('Gemini raw response:', text); // Debug log
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Gemini AI Search Error:', error);
      return [{ name: 'No results', photoUrl: '' }];
    }
  }

  async generatePdf(id: number): Promise<Buffer> {
    const celeb = await this.findOne(id);
    // Simple HTML template for the PDF
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; }
            .profile { text-align: center; }
            .photo { border-radius: 50%; width: 128px; height: 128px; object-fit: cover; margin-bottom: 16px; }
            .name { font-size: 2em; font-weight: bold; margin-bottom: 8px; }
            .meta { color: #555; margin-bottom: 8px; }
            .section { margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="profile">
            ${celeb.photoUrl ? `<img src="${celeb.photoUrl}" class="photo" />` : ''}
            <div class="name">${celeb.name}</div>
            <div class="meta">${celeb.category} • ${celeb.country}</div>
            <div class="meta">Fanbase: ${celeb.fanbase?.toLocaleString('en-US') ?? celeb.fanbase}</div>
            ${celeb.instagram ? `<div class="meta">Instagram: ${celeb.instagram}</div>` : ''}
            ${celeb.setlist ? `<div class="section"><b>Setlist / Topics:</b> ${celeb.setlist}</div>` : ''}
          </div>
        </body>
      </html>
    `;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }

  async aiAutofill(name: string): Promise<any> {
    const prompt = `Given the celebrity name '${name}', return a single valid JSON object with the following fields: name, category, country, instagram, fanbase, photoUrl, setlist. Use real or plausible data. Do not include any explanation or text outside the JSON object.`;
    try {
      const model = this.gemini.getGenerativeModel({ model: 'models/gemini-1.5-pro-latest' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Gemini AI Autofill Error:', error);
      return { name, category: '', country: '', instagram: '', fanbase: '', photoUrl: '', setlist: '' };
    }
  }

  async getCelebrityNews(name: string): Promise<any[]> {
    const apiKey = this.configService.get<string>('NEWSAPI_KEY');
    if (!apiKey) return [];
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(name)}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${apiKey}`;
    try {
      const response = await axios.get(url);
      return Array.isArray(response.data.articles) ? response.data.articles : [];
    } catch (error) {
      console.error('NewsAPI Error:', error);
      return [];
    }
  }
} 