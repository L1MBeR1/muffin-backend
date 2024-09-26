import { Gender } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UserDto {
	@IsOptional()
	@IsString()
	firstName?: string;

	@IsOptional()
	@IsString()
	lastName?: string;

	@IsOptional()
	@IsDateString({}, { message: 'Invalid birth date' })
	birthDate?: string;

	@IsOptional()
	@IsEnum(Gender, { message: 'Gender must be either man or woman' })
	gender?: Gender;
}
