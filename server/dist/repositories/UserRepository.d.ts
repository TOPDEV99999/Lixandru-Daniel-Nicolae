import { BaseRepository } from './BaseRepository';
import { User } from '../generated/prisma';
export interface CreateUserDto {
    email: string;
    password: string;
    name?: string;
    role?: string;
}
export interface UpdateUserDto {
    email?: string;
    name?: string;
    role?: string;
    password?: string;
}
export interface UserRepository extends BaseRepository<User, CreateUserDto, UpdateUserDto> {
    findByEmail(email: string): Promise<User | null>;
    validatePassword(user: User, password: string): Promise<boolean>;
}
//# sourceMappingURL=UserRepository.d.ts.map