import { BadRequestException, Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';
import * as argon2 from 'argon2';
import { hash } from 'argon2';
import { AuthDto } from '../auth/dto/auth.dto';
import { PrismaService } from '../prisma.service';
import { ChangeEmailDto } from './dto/changeEmail.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
			include: {
				roles: {
					include: {
						role: true,
					},
				},
			},
		});

		if (!user) {
			throw new BadRequestException('User not found');
		}

		const roleNames = user.roles.map(userRole => userRole.role.name);

		return {
			...user,
			roles: roleNames,
		};
	}

	async getByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
			include: {
				roles: {
					include: {
						role: true,
					},
				},
			},
		});

		if (!user) {
			throw new BadRequestException('User not found');
		}

		const roleNames = user.roles.map(userRole => userRole.role.name);

		return {
			...user,
			roles: roleNames,
		};
	}

	async getProfile(id: number) {
		const data = await this.getById(id);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...profile } = data;
		return profile;
	}

	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			password: await hash(dto.password),
			roles: {
				create: {
					role: {
						connect: {
							name: Roles.user,
						},
					},
				},
			},
		};
		return this.prisma.user.create({
			data: user,
			include: {
				roles: {
					include: {
						role: true,
					},
				},
			},
		});
	}

	async update(id: number, dto: UserDto) {
		const data = dto;

		return this.prisma.user.update({
			where: {
				id,
			},
			data,
			select: {
				id: true,
				firstName: true,
				lastName: true,
				patronymic: true,
				phone: true,
				gender: true,
			},
		});
	}
	async verifyPassword(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		return argon2.verify(hashedPassword, plainPassword);
	}

	async updatePassword(id: number, dto: ChangePasswordDto) {
		const user = await this.prisma.user.findUnique({ where: { id } });
		if (!user) {
			throw new BadRequestException('User not found');
		}

		const isMatch = await this.verifyPassword(dto.oldPassword, user.password);
		if (!isMatch) {
			throw new BadRequestException('Old password is incorrect');
		}

		const isSameAsOldPassword = await this.verifyPassword(
			dto.newPassword,
			user.password,
		);
		if (isSameAsOldPassword) {
			throw new BadRequestException(
				'New password cannot be the same as the old password',
			);
		}

		const hashedPassword = await argon2.hash(dto.newPassword);
		return this.prisma.user.update({
			where: { id },
			data: { password: hashedPassword },
			select: {
				id: true,
				firstName: true,
				lastName: true,
				patronymic: true,
				phone: true,
				gender: true,
			},
		});
	}
	async updateEmail(id: number, dto: ChangeEmailDto) {
		const user = await this.prisma.user.findUnique({ where: { id } });
		if (!user) {
			throw new BadRequestException('User not found');
		}

		const isMatch = await this.verifyPassword(dto.oldPassword, user.password);
		if (!isMatch) {
			throw new BadRequestException('Old password is incorrect');
		}

		return this.prisma.user.update({
			where: { id },
			data: { email: dto.email },
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				patronymic: true,
				phone: true,
				gender: true,
			},
		});
	}
}
