import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Celebrity } from './celebrity.entity';
export declare class FanController {
    private readonly userRepo;
    private readonly celebRepo;
    constructor(userRepo: Repository<User>, celebRepo: Repository<Celebrity>);
    private checkFan;
    follow(fanId: string, celebId: string, req: any): Promise<{
        message: string;
    }>;
    unfollow(fanId: string, celebId: string, req: any): Promise<{
        message: string;
    }>;
    getFollowing(fanId: string, req: any): Promise<Celebrity[]>;
}
