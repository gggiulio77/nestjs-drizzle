import { IsEmail, IsIn, IsString } from "class-validator";
import { Role, Roles } from "../entities/user.entity";

export class CreateUserDto {
    @IsString()
    name: string;
    @IsEmail()
    email: string;
    @IsString()
    password: string;
    @IsIn(Roles)
    role: Role;
}
