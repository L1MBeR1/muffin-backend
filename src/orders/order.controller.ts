import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
	constructor(private readonly ordersService: OrderService) {}
}
