import { IsEmail, IsString, MinLength } from 'class-validator';
import { MatchPasswords } from '../../validators/matchPassword.validator';

export class RegisterDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	password: string;

	@IsString()
	@MinLength(6, {
		message: 'Confirm password must be at least 6 characters long',
	})
	@MatchPasswords('password', {
		message: 'Confirm password does not match new password',
	})
	confirmPassword: string;
}
