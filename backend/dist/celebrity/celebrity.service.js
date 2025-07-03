"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CelebrityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const celebrity_entity_1 = require("./celebrity.entity");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
const puppeteer = require("puppeteer");
const axios_1 = require("axios");
let CelebrityService = class CelebrityService {
    celebrityRepository;
    configService;
    gemini;
    constructor(celebrityRepository, configService) {
        this.celebrityRepository = celebrityRepository;
        this.configService = configService;
        const geminiApiKey = this.configService.get('GEMINI_API_KEY');
        if (!geminiApiKey) {
            throw new Error('GEMINI_API_KEY is not set in the environment variables');
        }
        this.gemini = new generative_ai_1.GoogleGenerativeAI(geminiApiKey);
    }
    async create(createCelebrityDto) {
        const celebrity = this.celebrityRepository.create(createCelebrityDto);
        return this.celebrityRepository.save(celebrity);
    }
    async findAll() {
        return this.celebrityRepository.find();
    }
    async findOne(id) {
        const celebrity = await this.celebrityRepository.findOneBy({ id });
        if (!celebrity) {
            throw new common_1.NotFoundException('Celebrity not found');
        }
        return celebrity;
    }
    async update(id, updateCelebrityDto) {
        await this.celebrityRepository.update(id, updateCelebrityDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.celebrityRepository.delete(id);
    }
    async aiSearch(searchCelebrityDto) {
        const prompt = `
Given the following user query, suggest a list of 3-5 global performing celebrities that match.\nReturn ONLY a valid JSON array, where each item has \'name\' and \'photoUrl\' fields. Do not include any explanation or text outside the JSON array.\nQuery: ${searchCelebrityDto.query}
    `;
        try {
            const model = this.gemini.getGenerativeModel({ model: 'models/gemini-1.5-pro-latest' });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            console.log('Gemini raw response:', text);
            const jsonStart = text.indexOf('[');
            const jsonEnd = text.lastIndexOf(']') + 1;
            const jsonString = text.substring(jsonStart, jsonEnd);
            return JSON.parse(jsonString);
        }
        catch (error) {
            console.error('Gemini AI Search Error:', error);
            return [{ name: 'No results', photoUrl: '' }];
        }
    }
    async generatePdf(id) {
        const celeb = await this.findOne(id);
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
    async aiAutofill(name) {
        const prompt = `Given the celebrity name '${name}', return a single valid JSON object with the following fields: name, category, country, instagram, fanbase, photoUrl, setlist. Use real or plausible data. Do not include any explanation or text outside the JSON object.`;
        try {
            const model = this.gemini.getGenerativeModel({ model: 'models/gemini-1.5-pro-latest' });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            const jsonString = text.substring(jsonStart, jsonEnd);
            return JSON.parse(jsonString);
        }
        catch (error) {
            console.error('Gemini AI Autofill Error:', error);
            return { name, category: '', country: '', instagram: '', fanbase: '', photoUrl: '', setlist: '' };
        }
    }
    async getCelebrityNews(name) {
        const apiKey = this.configService.get('NEWSAPI_KEY');
        if (!apiKey)
            return [];
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(name)}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${apiKey}`;
        try {
            const response = await axios_1.default.get(url);
            return Array.isArray(response.data.articles) ? response.data.articles : [];
        }
        catch (error) {
            console.error('NewsAPI Error:', error);
            return [];
        }
    }
};
exports.CelebrityService = CelebrityService;
exports.CelebrityService = CelebrityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(celebrity_entity_1.Celebrity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], CelebrityService);
//# sourceMappingURL=celebrity.service.js.map