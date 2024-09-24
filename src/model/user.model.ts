import { ApiProperty } from '@nestjs/swagger';


export class RegisterUserRequest {

  @ApiProperty({
    example: 'tegar',
    required: true
  })
  username: string;

  @ApiProperty({
    example: 'tegar',
    required: true
  })
  password: string;

  @ApiProperty({
    example: 'Tegar Manthofani',
    required: true
  })
  name: string;

  @ApiProperty({
    example: 'tegar@customer.com',
    required: true
  })
  email: string;

  @ApiProperty({
    example: 'user',
    required: true
  })
  roles: string;
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
  email?: string;
  roles?: string;
}

export class UserResponse {
  username: string;
  name: string;
  email: string;
  roles?: string;
  token?: string;
}

export class LoginResponse {
  username: string;
  name: string;
  email: string;
  roles: string;
  token?: string;
}

export class SearchUserRequest {
  username?: string;
  name?: string;
  email?: string;
  roles?: string;
}
