import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserIterceptor implements NestInterceptor {
    constructor(private userService: UsersService) { }

    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if (userId) {
            const user = this.userService.findOne(userId);
            request.currentUser = user;
        }

        return handler.handle();
    }
}