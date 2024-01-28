import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './DTO/create-user.dto';
import { TicketsService } from 'src/tickets/tickets.service';
import { CartsService } from 'src/carts/carts.service';
import { CreateTicketDto } from 'src/tickets/DTO/create-ticket.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    private ticketsService: TicketsService,
    private cartsService: CartsService,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const duplicate = await this.usersModel
      .findOne({ email: user.email })
      .exec();
    if (duplicate) {
      throw new NotFoundException(
        `User with email ${user.email} already exists`,
      );
    }

    const newCart = await this.cartsService.create();

    user.password = bcrypt.hashSync(user.password, 10);

    const newUser = new this.usersModel({
      ...user,
      cart: newCart._id,
      tickets: [],
    });

    return newUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.usersModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersModel.findById(id).lean().exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({ email }).lean().exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByEmailPopulated(email: string): Promise<User> {
    const user = await this.usersModel
      .findOne({ email })
      .populate('tickets')
      .lean()
      .exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async addTicket(
    userId: Types.ObjectId,
    ticket: Types.ObjectId,
  ): Promise<User> {
    console.log('addTicket', userId, ticket);
    const user = await this.usersModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    user.tickets.push(ticket);

    return user.save();
  }

  async update(id: string, user: User): Promise<User> {
    const updatedUser = await this.usersModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }
  async updateByEmail(email: string, user: User): Promise<User> {
    const updatedUser = await this.usersModel.findOneAndUpdate(
      { email: email },
      user,
      {
        new: true,
      },
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return updatedUser;
  }

  async delete(id: string) {
    const deletedUser = await this.usersModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return;
  }
}
