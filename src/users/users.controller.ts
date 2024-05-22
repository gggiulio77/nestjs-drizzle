import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    HttpStatus,
    Res,
    HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller({ path: 'users', version: '1' })
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * Create users
     */
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    /**
     * Get all users
     */
    @Get()
    async findAll(): Promise<ResponseUserDto[]> {
        const result = await this.usersService.findAll();

        return plainToInstance(ResponseUserDto, result);
    }

    /**
     * Get user by id
     */
    @ApiNoContentResponse()
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Res() response: Response
    ): Promise<ResponseUserDto | undefined> {
        const result = await this.usersService.findOne(id);
        // TODO: think about this approach, maybe we can throw NotFound instead and remove @Res injection
        if (!result) {
            response.status(HttpStatus.NO_CONTENT).send();
            return undefined;
        }

        const user = plainToInstance(ResponseUserDto, result);

        response.json(user).send();
    }

    /**
     * Update user
     */
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<ResponseUserDto> {
        const result = await this.usersService.update(id, updateUserDto);

        return plainToInstance(ResponseUserDto, result);
    }

    /**
     * Delete user
     */
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.remove(id);
    }
}
