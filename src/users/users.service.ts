import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private _prisma: PrismaService,
    private _jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userAlreadyExists = await this._prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (userAlreadyExists) {
      throw new HttpException(
        'User already exists with this email.',
        HttpStatus.CONFLICT,
      );
    }

    const passwordEncrypted = await bcrypt.hash(createUserDto.password, 10);

    const user = await this._prisma.user.create({
      data: {
        ...createUserDto,
        password: passwordEncrypted,
      },
    });

    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this._prisma.user.findUnique({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const isPasswordEqual = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordEqual) {
      throw new HttpException('Password doesnt match.', HttpStatus.BAD_REQUEST);
    }

    const payload = { id: user.id, email: user.email };

    return {
      user: {
        ...user,
      },
      token: await this._jwtService.signAsync(payload),
    };
  }
}
