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
exports.FanController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const celebrity_entity_1 = require("./celebrity.entity");
let FanController = class FanController {
    userRepo;
    celebRepo;
    constructor(userRepo, celebRepo) {
        this.userRepo = userRepo;
        this.celebRepo = celebRepo;
    }
    checkFan(req, fanId) {
        if (req.user.role !== user_entity_1.UserRole.FAN || req.user.userId !== Number(fanId)) {
            throw new common_1.ForbiddenException('Not allowed');
        }
    }
    async follow(fanId, celebId, req) {
        this.checkFan(req, fanId);
        const fan = await this.userRepo.findOne({ where: { id: Number(fanId) }, relations: ['following'] });
        const celeb = await this.celebRepo.findOne({ where: { id: Number(celebId) } });
        if (!fan || !celeb)
            throw new common_1.ForbiddenException('Fan or celebrity not found');
        if (!fan.following)
            fan.following = [];
        if (!fan.following.find(c => c.id === celeb.id)) {
            fan.following.push(celeb);
            await this.userRepo.save(fan);
        }
        return { message: 'Followed' };
    }
    async unfollow(fanId, celebId, req) {
        this.checkFan(req, fanId);
        const fan = await this.userRepo.findOne({ where: { id: Number(fanId) }, relations: ['following'] });
        if (!fan)
            throw new common_1.ForbiddenException('Fan not found');
        fan.following = fan.following.filter(c => c.id !== Number(celebId));
        await this.userRepo.save(fan);
        return { message: 'Unfollowed' };
    }
    async getFollowing(fanId, req) {
        this.checkFan(req, fanId);
        const fan = await this.userRepo.findOne({ where: { id: Number(fanId) }, relations: ['following'] });
        return fan?.following || [];
    }
};
exports.FanController = FanController;
__decorate([
    (0, common_1.Post)(':fanId/follow/:celebId'),
    __param(0, (0, common_1.Param)('fanId')),
    __param(1, (0, common_1.Param)('celebId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "follow", null);
__decorate([
    (0, common_1.Delete)(':fanId/unfollow/:celebId'),
    __param(0, (0, common_1.Param)('fanId')),
    __param(1, (0, common_1.Param)('celebId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "unfollow", null);
__decorate([
    (0, common_1.Get)(':fanId/following'),
    __param(0, (0, common_1.Param)('fanId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FanController.prototype, "getFollowing", null);
exports.FanController = FanController = __decorate([
    (0, common_1.Controller)('fans'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(celebrity_entity_1.Celebrity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FanController);
//# sourceMappingURL=fan.controller.js.map