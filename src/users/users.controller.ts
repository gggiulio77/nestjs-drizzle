import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
@ApiTags('users')
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
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ResponseUserDto> {
        const result = await this.usersService.findOne(id);

        return plainToInstance(ResponseUserDto, result);
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
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.remove(id);
    }
}
