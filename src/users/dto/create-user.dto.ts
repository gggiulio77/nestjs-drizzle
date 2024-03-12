import { IsEmail, IsEnum, IsIn, IsString } from "class-validator";
import { Role, Roles } from "../entities/user.entity";

/**
 * User creation input
 */
export class CreateUserDto {
    /**
     * User name
     * @example 'John'
    */
    @IsString()
    name: string;
    /**
     * User email
     * @example 'john@gmail.com'
    */
    @IsEmail()
    email: string;
    /**
     * User password
     * @example 'easy'
    */
    @IsString()
    password: string;
    /**
     * User role
     * @example 'admin'
    */
    @IsIn(Roles)
    role: Role;
}
