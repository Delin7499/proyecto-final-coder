import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
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
    const newCart = await this.cartsService.create();

    user.password = bcrypt.hashSync(user.password, 10);

    const newUser = new this.usersModel({
      ...user,
      cart: newCart._id,
      tickets: [],
    });

    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.usersModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async addTicket(userId: string, ticket: CreateTicketDto): Promise<User> {
    const user = await this.usersModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const newTicket = await this.ticketsService.create(ticket);

    user.tickets.push(newTicket._id.toString());

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

  async delete(id: string) {
    const deletedUser = await this.usersModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return;
  }
}
