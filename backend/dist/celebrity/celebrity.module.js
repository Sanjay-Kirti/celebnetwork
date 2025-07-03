"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CelebrityModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const celebrity_entity_1 = require("./celebrity.entity");
const celebrity_service_1 = require("./celebrity.service");
const celebrity_controller_1 = require("./celebrity.controller");
const fan_controller_1 = require("./fan.controller");
const user_entity_1 = require("./user.entity");
let CelebrityModule = class CelebrityModule {
};
exports.CelebrityModule = CelebrityModule;
exports.CelebrityModule = CelebrityModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([celebrity_entity_1.Celebrity, user_entity_1.User])],
        providers: [celebrity_service_1.CelebrityService],
        controllers: [celebrity_controller_1.CelebrityController, fan_controller_1.FanController]
    })
], CelebrityModule);
//# sourceMappingURL=celebrity.module.js.map