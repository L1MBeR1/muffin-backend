import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();
console.log('Front URL:', process.env.FRONT_URL);

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.setGlobalPrefix('api');
	app.use(cookieParser());

	app.enableCors({
		origin: [process.env.FRONT_URL],
		credentials: true,
		exposedHeaders: ['set-cookie'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
	});

	app.use((req, res, next) => {
		if (req.method === 'OPTIONS') {
			res.header('Access-Control-Allow-Origin', process.env.FRONT_URL);
			res.header(
				'Access-Control-Allow-Methods',
				'GET, POST, PUT, DELETE, OPTIONS',
			);
			res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
			res.header('Access-Control-Allow-Credentials', 'true');
			return res.sendStatus(200);
		}
		next();
	});
	await app.listen(4200);
}

bootstrap();
