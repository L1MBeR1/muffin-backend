import { IsString, MinLength } from 'class-validator';
import { MatchPasswords } from '../validators/matchPassword.validator';

export class ChangePasswordDto {
	@IsString()
	@MinLength(6, { message: 'Old password must be at least 6 characters long' })
	oldPassword: string;

	@IsString()
	@MinLength(6, { message: 'New password must be at least 6 characters long' })
	newPassword: string;

	@IsString()
	@MinLength(6, {
		message: 'Confirm password must be at least 6 characters long',
	})
	@MatchPasswords('newPassword', {
		message: 'Confirm password does not match new password',
	})
	confirmPassword: string;
}
