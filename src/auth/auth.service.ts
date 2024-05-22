import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import * as argon2 from 'argon2';
import { Except } from '@utility/index';

export interface JwtPayload {
    sub: User['id'];
    email: User['email'];
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(
        email: string,
        password: string
    ): Promise<Except<User, 'hashPassword'> | undefined> {
        const user = await this.usersService.findOne(email);

        if (!user) return undefined;
        // TODO: think about a hashing/verify service to abstract the methods (hash, verify)
        const isPassword = await argon2.verify(user.hashPassword, password);

        if (isPassword) {
            const { hashPassword: _, ...result } = user;

            return result;
        }

        return undefined;
    }

    async login(user: User): Promise<Record<'access_token', string>> {
        const payload: JwtPayload = { email: user.email, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
