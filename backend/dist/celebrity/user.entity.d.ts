import { Celebrity } from './celebrity.entity';
export declare enum UserRole {
    FAN = "fan",
    CELEBRITY = "celebrity"
}
export declare class User {
    id: number;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    following: Celebrity[];
}
