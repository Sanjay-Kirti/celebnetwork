import { User } from './user.entity';
export declare class Celebrity {
    id: number;
    name: string;
    category: string;
    country: string;
    instagram: string;
    fanbase: number;
    photoUrl: string;
    setlist: string;
    fans: User[];
}
