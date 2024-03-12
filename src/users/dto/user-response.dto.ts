import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Role, Roles } from "../entities/user.entity";

export class UserDto {
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
