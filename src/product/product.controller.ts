import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	ValidationPipe,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetProductsWithOrdersDto } from './dto/getProductWithOriders.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@HttpCode(200)
	@Post('orders')
	@Auth('admin')
	async getProductsWithOrders(
		@Body(new ValidationPipe({ transform: true }))
		dto: GetProductsWithOrdersDto,
	) {
		return this.productService.getProductsWithOrders(dto);
	}

	@HttpCode(200)
	@Get('all/select')
	@Auth('admin')
	async getProductsSelect() {
		return this.productService.getAllProductsForSelect();
	}
}
