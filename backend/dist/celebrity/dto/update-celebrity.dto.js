"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCelebrityDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_celebrity_dto_1 = require("./create-celebrity.dto");
class UpdateCelebrityDto extends (0, mapped_types_1.PartialType)(create_celebrity_dto_1.CreateCelebrityDto) {
}
exports.UpdateCelebrityDto = UpdateCelebrityDto;
//# sourceMappingURL=update-celebrity.dto.js.map