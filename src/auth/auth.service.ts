import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import * as argon2 from 'argon2';

export interface JwtPayload {
    sub: User['id'];
    email: User['email'];
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(
        email: string,
        password: string
    ): Promise<Omit<User, User['hashPassword']> | null> {
        const user = await this.usersService.findOne(email);

        if (user == undefined || user == null) return null;
        // TODO: think about a hashing/verify service to abstract the methods (hash, verify)
        const isPassword = await argon2.verify(user.hashPassword, password);

        if (isPassword) {
            const { hashPassword: _, ...result } = user;

            return result;
        }

        return null;
    }

    async login(user: User): Promise<Record<'access_token', string>> {
        const payload: JwtPayload = { email: user.email, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
