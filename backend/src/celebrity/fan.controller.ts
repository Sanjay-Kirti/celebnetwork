import { Controller, Post, Delete, Get, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { Celebrity } from './celebrity.entity';

@Controller('fans')
@UseGuards(JwtAuthGuard)
export class FanController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Celebrity)
    private readonly celebRepo: Repository<Celebrity>,
  ) {}

  // Helper: Only allow fan to modify their own follows
  private checkFan(req: any, fanId: string) {
    if (req.user.role !== UserRole.FAN || req.user.userId !== Number(fanId)) {
      throw new ForbiddenException('Not allowed');
    }
  }

  @Post(':fanId/follow/:celebId')
  async follow(@Param('fanId') fanId: string, @Param('celebId') celebId: string, @Req() req: any) {
    this.checkFan(req, fanId);
    const fan = await this.userRepo.findOne({ where: { id: Number(fanId) }, relations: ['following'] });
    const celeb = await this.celebRepo.findOne({ where: { id: Number(celebId) } });
    if (!fan || !celeb) throw new ForbiddenException('Fan or celebrity not found');
    if (!fan.following) fan.following = [];
    if (!fan.following.find(c => c.id === celeb.id)) {
      fan.following.push(celeb);
      await this.userRepo.save(fan);
    }
    return { message: 'Followed' };
  }

  @Delete(':fanId/unfollow/:celebId')
  async unfollow(@Param('fanId') fanId: string, @Param('celebId') celebId: string, @Req() req: any) {
    this.checkFan(req, fanId);
    const fan = await this.userRepo.findOne({ where: { id: Number(fanId) }, relations: ['following'] });
    if (!fan) throw new ForbiddenException('Fan not found');
    fan.following = fan.following.filter(c => c.id !== Number(celebId));
    await this.userRepo.save(fan);
    return { message: 'Unfollowed' };
  }

  @Get(':fanId/following')
  async getFollowing(@Param('fanId') fanId: string, @Req() req: any) {
    this.checkFan(req, fanId);
    const fan = await this.userRepo.findOne({ where: { id: Number(fanId) }, relations: ['following'] });
    return fan?.following || [];
  }
} 