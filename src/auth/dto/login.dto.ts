import { IsEmail, IsString } from 'class-validator';

/**
 * Login input
 */
export class LoginDto {
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
}
