import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { User } from '@users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { ResponseLoginDto } from './dto/response-login.dto';
import { plainToInstance } from 'class-transformer';

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
    }
}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Log in endpoint
     */
    @HttpCode(HttpStatus.OK)
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Req() req: Request<{ user: User }>,
        @Body() _loginDto: LoginDto
    ): Promise<ResponseLoginDto> {
        const result = this.authService.login(req.user);

        return plainToInstance(ResponseLoginDto, result);
    }

    // TODO: add refresh method
}
