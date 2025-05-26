// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Post,
//   Put,
//   Delete,
//   HttpCode,
//   HttpStatus,
//   ParseUUIDPipe,
//   Query,
// } from '@nestjs/common';
// import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { plainToInstance } from 'class-transformer';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dtos/create-user.dto';
// import { UpdateUserDto } from './dtos/update-user.dto';
// import { UserResponseDto } from './dtos/user-response.dto';
// import { QueryUserDto } from './dtos/query-user.dto';

// @ApiTags('Users')
// @Controller('users')
// export class UserController {
//   constructor(private userService: UserService) {}

//   @Post('/')
//   @ApiOperation({ summary: 'Create new user' })
//   @ApiResponse({
//     status: 201,
//     description: 'User created successfully',
//     type: UserResponseDto,
//   })
//   @ApiResponse({ status: 400, description: 'Invalid data' })
//   @ApiResponse({ status: 409, description: 'Username already exists' })
//   @ApiResponse({ status: 500, description: 'Internal Server Error' })
//   @HttpCode(HttpStatus.CREATED)
//   async createUser(@Body() createUserDto: CreateUserDto) {
//     const user = await this.userService.create(createUserDto);

//     return RestResponse.success(201, 'User created successfully', {
//       user: plainToInstance(UserResponseDto, user),
//     });
//   }

//   @Get('/')
//   @ApiOperation({ summary: 'Get all users with pagination' })
//   @ApiResponse({
//     status: 200,
//     description: 'Users retrieved successfully',
//     type: Array<UserResponseDto>,
//   })
//   @ApiResponse({ status: 500, description: 'Internal Server Error' })
//   @HttpCode(HttpStatus.OK)
//   async getUsersWithPagination(@Query() query: QueryUserDto) {
//     const page = query?.page ?? 1;
//     let limit = query?.limit ?? 10;
//     if (limit > 50) {
//       limit = 50;
//     }

//     // To do

//     return RestResponse.success(200, 'Users retrieved successfully', []);
//   }

//   @Get('/get/all')
//   @ApiOperation({ summary: 'Get all users' })
//   @ApiResponse({
//     status: 200,
//     description: 'Users retrieved successfully',
//     type: Array<UserResponseDto>,
//   })
//   @ApiResponse({ status: 500, description: 'Internal Server Error' })
//   @HttpCode(HttpStatus.OK)
//   async getAllUsers() {
//     const users = await this.userService.findAll();
//     return RestResponse.success(200, 'Users retrieved successfully', {
//       users: users.map((user) => plainToInstance(UserResponseDto, user)),
//     });
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Retrieve a user' })
//   @ApiResponse({
//     status: 200,
//     description: 'User retrieved successfully',
//     type: UserResponseDto,
//   })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   @ApiResponse({ status: 500, description: 'Internal Server Error' })
//   @HttpCode(HttpStatus.OK)
//   async getUserById(@Param('id') id: string) {
//     const user = await this.userService.findById(id);
//     return RestResponse.success(200, 'User retrieved successfully', {
//       user: plainToInstance(UserResponseDto, user),
//     });
//   }

//   @Put(':id')
//   @ApiOperation({ summary: 'Update a user' })
//   @ApiResponse({
//     status: 200,
//     description: 'User updated successfully',
//     type: UserResponseDto,
//   })
//   @ApiResponse({ status: 400, description: 'Invalid data' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   @ApiResponse({ status: 500, description: 'Internal Server Error' })
//   @HttpCode(HttpStatus.OK)
//   async updateUserById(
//     @Param('id', ParseUUIDPipe) id: string,
//     @Body() updateUserDto: UpdateUserDto,
//   ) {
//     const updatedUser = await this.userService.update(id, updateUserDto);
//     return RestResponse.success(200, 'User updated successfully', {
//       user: plainToInstance(UserResponseDto, updatedUser),
//     });
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete a user' })
//   @ApiResponse({
//     status: 204,
//     description: 'User deleted successfully',
//   })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   @ApiResponse({ status: 500, description: 'Internal Server Error' })
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async deleteUserById(@Param('id') id: string) {
//     await this.userService.deleteById(id);
//     return RestResponse.success(204, 'User deleted successfully', {});
//   }
// }
