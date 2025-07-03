import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CelebrityService } from './celebrity/celebrity.service';
import { celebrities } from './celebrity/seed-celebrities';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const celebrityService = app.get(CelebrityService);

  for (const celeb of celebrities) {
    try {
      await celebrityService.create(celeb);
      console.log(`Seeded: ${celeb.name}`);
    } catch (e) {
      console.error(`Failed to seed: ${celeb.name}`, e.message);
    }
  }

  await app.close();
}

bootstrap(); 