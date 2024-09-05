import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';

export const Auth = (...roles: string[]) => {
	return applyDecorators(
		SetMetadata('roles', roles),
		UseGuards(JwtAuthGuard, RolesGuard),
	);
};
