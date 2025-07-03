import { Test, TestingModule } from '@nestjs/testing';
import { CelebrityController } from './celebrity.controller';

describe('CelebrityController', () => {
  let controller: CelebrityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CelebrityController],
    }).compile();

    controller = module.get<CelebrityController>(CelebrityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
