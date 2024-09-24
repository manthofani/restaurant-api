import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  RegisterUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
  LoginResponse,
  UserResponse,
  SearchUserRequest,
} from '../../model/user.model';
import { WebResponse } from '../../model/web.model';
import { ValidationService } from '../../common/validation.service';
import { UserValidation } from './user.validation';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../../common/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);

    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
      email: user.email,
    };
  }

  async login(request: LoginUserRequest): Promise<LoginResponse> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`);
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Username or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Username or password is invalid', 401);
    }

    user = await this.prismaService.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuid(),
      },
    });

    return {
      username: user.username,
      name: user.name,
      email: user.email,
      roles: user.roles,
      token: user.token,
    };
  }

  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
      email: user.email,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update( ${JSON.stringify(user)} , ${JSON.stringify(request)} )`,
    );

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.email) {
      user.email = updateRequest.email;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return {
      name: result.name,
      username: result.username,
      email: result.email,
    };
  }

  async logout(user: User): Promise<UserResponse> {
    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });

    return {
      username: result.username,
      name: result.name,
      email: result.email,
    };
  }

  // Perform By Admin

  toUserResponse(users: User): UserResponse {
    return {
      username: users.username,
      name: users.name,
      email: users.email,
      roles: users.roles,
    };
  }

  async SearchUser(
    user: User,
    request: SearchUserRequest,
  ): Promise<WebResponse<UserResponse[]>> {
    const filters = [];

    const searchRequest: SearchUserRequest = this.validationService.validate(
      UserValidation.SEARCH,
      request,
    );

    if (searchRequest.username) {
      filters.push({
        username: searchRequest.username,
      });
    }

    if (searchRequest.name) {
      filters.push({
        name: searchRequest.name,
      });
    }

    if (searchRequest.email) {
      filters.push({
        email: searchRequest.email,
      });
    }

    if (searchRequest.roles) {
      filters.push({
        roles: searchRequest.roles,
      });
    }

    if (!filters.length) {
      filters.push({
        roles: 'user',
      });
    }

    const users = await this.prismaService.user.findMany({
      where: {
        AND: filters,
      },
    });

    return {
      data: users.map((user) => this.toUserResponse(user)),
    };
  }

  async updateUser(
    user: User,
    username: string,
    request: UpdateUserRequest,
  ): Promise<UserResponse> {
    this.logger.debug(
      `UserService.updateUser( ${JSON.stringify(user)} , ${JSON.stringify(request)} )`,
    );

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    if (updateRequest.email) {
      user.email = updateRequest.email;
    }

    if (updateRequest.roles) {
      user.roles = updateRequest.roles;
    }

    const result = await this.prismaService.user.update({
      where: {
        username: username,
      },
      data: user,
    });

    return {
      username: result.username,
      name: result.name,
      email: result.email,
      roles: result.roles,
    };
  }
}
