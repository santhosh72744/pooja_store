import { Controller, Get, Req, UseGuards } from '@nestjs/common';


@Controller('users')
export class UsersController {

  
  @Get('me')
  getMe(@Req() req) {
    return req.user;
  }
}
