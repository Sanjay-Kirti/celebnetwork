import { Repository } from 'typeorm';
import { User, UserRole } from '../celebrity/user.entity';
import { RegisterUserDto } from '../celebrity/dto/register-user.dto';
import { LoginUserDto } from '../celebrity/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(dto: RegisterUserDto): Promise<{
        message: string;
    }>;
    login(dto: LoginUserDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: UserRole;
        };
    }>;
}
