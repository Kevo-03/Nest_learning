import { Controller, Post, Get, Patch, Delete, Query, Param, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {

    constructor(private service: UsersService) { }

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        this.service.create(body.email, body.password);
    }

    @Get('/:id')
    findUser(@Param('id') id: string) {
        return this.service.findOne(parseInt(id));
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.service.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.service.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.service.update(parseInt(id), body);
    }
}
