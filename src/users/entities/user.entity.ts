export const Roles = ['admin', 'customer'] as const;
export type Role = typeof Roles[number];

export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
