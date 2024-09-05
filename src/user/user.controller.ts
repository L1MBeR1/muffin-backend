import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { ChangeEmailDto } from './dto/changeEmail.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth('admin')
	async profile(@CurrentUser('id') id: number) {
		return this.userService.getProfile(id);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('profile')
	@Auth()
	async updateProfile(@CurrentUser('id') id: number, @Body() dto: UserDto) {
		return this.userService.update(id, dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('profile/password')
	@Auth()
	async updatePassword(
		@CurrentUser('id') id: number,
		@Body() dto: ChangePasswordDto,
	) {
		return this.userService.updatePassword(id, dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('profile/email')
	@Auth()
	async updateEmail(
		@CurrentUser('id') id: number,
		@Body() dto: ChangeEmailDto,
	) {
		return this.userService.updateEmail(id, dto);
	}
}
