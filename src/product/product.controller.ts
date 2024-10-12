import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	ValidationPipe,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { SalesAnalysisDto } from './dto/getProductWithOriders.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@HttpCode(200)
	@Post('orders')
	@Auth('admin')
	async getProductsWithOrders(
		@Body(new ValidationPipe({ transform: true }))
		dto: SalesAnalysisDto,
	) {
		return this.productService.getProductsWithOrders(dto);
	}

	@HttpCode(200)
	@Post('buyers')
	@Auth('admin')
	async getBuyersAnalysis(
		@Body(new ValidationPipe({ transform: true }))
		dto: SalesAnalysisDto,
	) {
		return this.productService.getCustomerDataForCharts(dto);
	}

	@HttpCode(200)
	@Get('all/select')
	@Auth('admin')
	async getProductsSelect() {
		return this.productService.getAllProductsForSelect();
	}
}
