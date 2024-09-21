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
		origin: process.env.FRONT_URL || '*',
		credentials: true,
		exposedHeaders: 'set-cookie',
	});

	app.use((req, res, next) => {
		res.header(
			'Access-Control-Allow-Origin',
			process.env.FRONT_URL || 'https://maffin.vercel.app',
		);
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept',
		);
		if (req.method === 'OPTIONS') {
			return res.sendStatus(200);
		}
		next();
	});

	await app.listen(4200);
}

bootstrap();
