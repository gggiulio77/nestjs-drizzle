import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Role, Roles, User } from "../entities/user.entity";
import { Exclude } from "class-transformer";

export class UserDto implements User {
    /**
     * User id
     * @example 1
    */
    id: number;
    /**
     * User name
     * @example 'John'
    */
    name: string;
    /**
     * User email
     * @example 'john@gmail.com'
    */
    email: string;
    /**
     * User password
     * @example 'easy'
    */
    @ApiHideProperty()
    @Exclude()
    password: string;
    /**
     * User role
     * @example 'admin'
    */
    @ApiProperty({ enum: Roles })
    role: Role;
    /**
     * User creation date
     * @example '2024-03-12T14:40:21.023Z'
    */
    createdAt: Date;
    /**
     * User last updated date
     * @example '2024-03-12T14:40:21.023Z'
    */
    updatedAt: Date;
}
