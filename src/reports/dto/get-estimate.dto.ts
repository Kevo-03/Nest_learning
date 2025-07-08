import { IsString, IsNumber, Min, Max, IsLatitude, IsLongitude } from "class-validator";

export class GetEstimateDto {
    @IsString()
    make: string;
    @IsString()
    model: string;
    @IsNumber()
    @Min(1930)
    @Max(2050)
    year: number;
    @IsNumber()
    @Min(0)
    @Max(100000)
    mileage: number;
    @IsNumber()
    @IsLongitude()
    lng: number;
    @IsNumber()
    @IsLatitude()
    lat: number;
}