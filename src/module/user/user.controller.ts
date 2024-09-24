import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../../model/web.model';
import {
  RegisterUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
  LoginResponse,
  UserResponse,
  SearchUserRequest,
} from '../../model/user.model';
import { Auth } from '../../common/auth.decorator';
import { User } from '@prisma/client';
import { ApiResponse } from '@nestjs/swagger';


@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Username already registered'})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.register(request);
    return {
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<LoginResponse>> {
    const result = await this.userService.login(request);
    return {
      data: result,
    };
  }

  @Get('/account')
  @HttpCode(200)
  async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.get(user);
    return {
      data: result,
    };
  }

  @Patch('/account')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Body() request: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('/account')
  @HttpCode(200)
  async logout(@Auth() user: User): Promise<WebResponse<boolean>> {
    await this.userService.logout(user);
    return {
      data: true,
    };
  }

  @Get()
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('username') username?: string,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('roles') roles?: string,
  ): Promise<WebResponse<UserResponse[]>> {
    const request: SearchUserRequest = {
      username: username,
      name: name,
      email: email,
      roles: roles,
    };

    return this.userService.SearchUser(user, request);
  }

  @Patch('/account/:username')
  @HttpCode(200)
  async updateUser(
    @Auth() user: User,
    @Param('username') username: string,
    @Body() request: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.updateUser(user, username, request);
    return {
      data: result,
    };
  }
}
