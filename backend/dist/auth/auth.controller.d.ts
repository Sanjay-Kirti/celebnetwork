import { AuthService } from './auth.service';
import { RegisterUserDto } from '../celebrity/dto/register-user.dto';
import { LoginUserDto } from '../celebrity/dto/login-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterUserDto): Promise<{
        message: string;
    }>;
    login(dto: LoginUserDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: import("../celebrity/user.entity").UserRole;
        };
    }>;
}
