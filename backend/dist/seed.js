"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const celebrity_service_1 = require("./celebrity/celebrity.service");
const seed_celebrities_1 = require("./celebrity/seed-celebrities");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const celebrityService = app.get(celebrity_service_1.CelebrityService);
    for (const celeb of seed_celebrities_1.celebrities) {
        try {
            await celebrityService.create(celeb);
            console.log(`Seeded: ${celeb.name}`);
        }
        catch (e) {
            console.error(`Failed to seed: ${celeb.name}`, e.message);
        }
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map