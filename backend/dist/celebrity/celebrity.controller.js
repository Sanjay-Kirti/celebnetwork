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
exports.CelebrityController = void 0;
const common_1 = require("@nestjs/common");
const celebrity_service_1 = require("./celebrity.service");
const create_celebrity_dto_1 = require("./dto/create-celebrity.dto");
const update_celebrity_dto_1 = require("./dto/update-celebrity.dto");
const search_celebrity_dto_1 = require("./dto/search-celebrity.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CelebrityController = class CelebrityController {
    celebrityService;
    constructor(celebrityService) {
        this.celebrityService = celebrityService;
    }
    create(createCelebrityDto) {
        return this.celebrityService.create(createCelebrityDto);
    }
    findAll() {
        return this.celebrityService.findAll();
    }
    findOne(id) {
        return this.celebrityService.findOne(Number(id));
    }
    update(id, updateCelebrityDto) {
        return this.celebrityService.update(Number(id), updateCelebrityDto);
    }
    remove(id) {
        return this.celebrityService.remove(Number(id));
    }
    async aiSearch(searchCelebrityDto) {
        const aiResults = await this.celebrityService.aiSearch(searchCelebrityDto);
        const allCelebs = await this.celebrityService.findAll();
        const resultsWithId = aiResults.map((ai) => {
            const aiName = ai.name.trim().toLowerCase();
            const match = allCelebs.find(c => c.name.trim().toLowerCase() === aiName ||
                c.name.trim().toLowerCase().includes(aiName) ||
                aiName.includes(c.name.trim().toLowerCase()));
            return match ? { ...ai, id: match.id } : ai;
        });
        return resultsWithId;
    }
    async getCelebrityPdf(id, res) {
        const pdfBuffer = await this.celebrityService.generatePdf(Number(id));
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=celebrity-${id}.pdf`,
        });
        res.send(pdfBuffer);
    }
    async aiAutofill(name) {
        return this.celebrityService.aiAutofill(name);
    }
    async getCelebrityNews(id) {
        const celeb = await this.celebrityService.findOne(Number(id));
        if (!celeb)
            return [];
        return this.celebrityService.getCelebrityNews(celeb.name);
    }
    async getGeneralCelebrityNews() {
        return this.celebrityService.getCelebrityNews('celebrity OR celebrities');
    }
};
exports.CelebrityController = CelebrityController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_celebrity_dto_1.CreateCelebrityDto]),
    __metadata("design:returntype", void 0)
], CelebrityController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CelebrityController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CelebrityController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_celebrity_dto_1.UpdateCelebrityDto]),
    __metadata("design:returntype", void 0)
], CelebrityController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CelebrityController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('search'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_celebrity_dto_1.SearchCelebrityDto]),
    __metadata("design:returntype", Promise)
], CelebrityController.prototype, "aiSearch", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CelebrityController.prototype, "getCelebrityPdf", null);
__decorate([
    (0, common_1.Post)('ai-autofill'),
    __param(0, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CelebrityController.prototype, "aiAutofill", null);
__decorate([
    (0, common_1.Get)(':id/news'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CelebrityController.prototype, "getCelebrityNews", null);
__decorate([
    (0, common_1.Get)('news'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CelebrityController.prototype, "getGeneralCelebrityNews", null);
exports.CelebrityController = CelebrityController = __decorate([
    (0, common_1.Controller)('celebrities'),
    __metadata("design:paramtypes", [celebrity_service_1.CelebrityService])
], CelebrityController);
//# sourceMappingURL=celebrity.controller.js.map