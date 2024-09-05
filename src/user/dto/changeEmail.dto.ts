import { IsEmail, IsString, MinLength } from 'class-validator';

export class ChangeEmailDto {
	@IsString()
	@MinLength(6, { message: 'Old password must be at least 6 characters long' })
	oldPassword: string;

	@IsEmail()
	email: string;
}
