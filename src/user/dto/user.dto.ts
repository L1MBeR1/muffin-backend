import { Gender } from '@prisma/client';
import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UserDto {
	@IsOptional()
	@IsString()
	firstName?: string;

	@IsOptional()
	@IsString()
	lastName?: string;

	@IsOptional()
	@IsString()
	patronymic?: string;

	@IsOptional()
	@IsPhoneNumber(null, { message: 'Invalid phone number' })
	phone?: string;

	@IsOptional()
	@IsEnum(Gender, { message: 'Gender must be either man or woman' })
	gender?: Gender;
}
