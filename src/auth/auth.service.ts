import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1;
	REFRESH_TOKEN_NAME = 'refreshToken';

	constructor(
		private jwt: JwtService,
		private userService: UserService,
	) {}

	async login(dto: AuthDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto);

		const tokens = this.issueTokens(user);

		return {
			user,
			...tokens,
		};
	}

	async register(dto: RegisterDto) {
		const oldUser = await this.userService.getByEmail(dto.email);

		if (oldUser) throw new BadRequestException('User already exists');

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...userWithRoles } = await this.userService.create(dto);
		const user = {
			...userWithRoles,
			roles: userWithRoles.roles.map(role => role.role.name),
		};
		const tokens = this.issueTokens(user);

		return {
			user,
			...tokens,
		};
	}
	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken);

		if (!result) throw new UnauthorizedException('Invalid refresh token');

		const user = await this.userService.getById(result.id);

		console.log('User data:', user);

		const tokens = this.issueTokens(user);

		return {
			user,
			...tokens,
		};
	}

	private issueTokens(user: { id: number; roles: string[] }) {
		console.log('Issuing tokens with user data:', user);

		const data = {
			id: user.id,
			roles: user.roles,
		};

		const accessToken = this.jwt.sign(data, {
			expiresIn: '7d',
		});
		// const refreshToken = this.jwt.sign(data, {
		// 	expiresIn: '7d',
		// });

		return {
			accessToken,
			// refreshToken
		};
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email);

		if (!user) throw new NotFoundException('User not found');

		const isValid = await verify(user.password, dto.password);

		if (!isValid) throw new UnauthorizedException('Invalid password');
		return user;
	}

	// addRefreshTokenToResponse(res: Response, refreshToken: string) {
	// 	const expiresIn = new Date();
	// 	expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
	// 	res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
	// 		httpOnly: true,
	// 		expires: expiresIn,
	// 		domain: process.env.DOMAIN,
	// 		secure: true,
	// 		sameSite: 'none',
	// 		path: '/',
	// 	});
	// }

	removeRefreshTokenToResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: process.env.DOMAIN,
			expires: new Date(0),
			secure: true,
			sameSite: 'none',
			path: '/',
		});
	}
}
