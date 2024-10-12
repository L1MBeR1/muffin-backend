import { IsDateString, IsInt, IsOptional, IsPositive } from 'class-validator';

export class SalesAnalysisDto {
	@IsOptional()
	@IsDateString({}, { message: 'Invalid start date' })
	startDate?: string;

	@IsOptional()
	@IsDateString({}, { message: 'Invalid end date' })
	endDate?: string;

	@IsOptional()
	@IsInt()
	@IsPositive()
	productId?: number;
}
