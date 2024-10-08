import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './orders/order.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, UserModule, OrderModule, ProductModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
