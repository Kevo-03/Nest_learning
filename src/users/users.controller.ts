import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {

    constructor(private service: UsersService) { }

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        this.service.create(body.email, body.password);
    }
}
