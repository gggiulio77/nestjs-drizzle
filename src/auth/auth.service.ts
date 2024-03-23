import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(email);

        // TODO: implement hashing
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: User): Promise<Record<'access_token', string>> {
        const payload = { email: user.email, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
