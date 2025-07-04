import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/users/dto/user.dto';

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto: any) { }

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {

        return handler.handle().pipe(
            map((data: any) => {
                return plainToInstance(UserDto, data, { excludeExtraneousValues: true });
            })
        );
    }
}