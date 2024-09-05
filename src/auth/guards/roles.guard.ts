import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const user = request.user;

		const requiredRoles = this.reflector.get<string[]>(
			'roles',
			context.getHandler(),
		);

		if (!requiredRoles || requiredRoles.length === 0) {
			return true;
		}

		if (!user || !user.roles) {
			throw new ForbiddenException('Access denied');
		}

		const hasRole = () => requiredRoles.some(role => user.roles.includes(role));
		if (!hasRole()) {
			throw new ForbiddenException('Access denied');
		}

		return true;
	}
}
