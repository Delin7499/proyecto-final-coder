import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { PaginationResponse } from 'src/common/interfaces/pagination-response.interface';
import { CreateTicketDto } from './DTO/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) {}

  async create(ticket: CreateTicketDto): Promise<TicketDocument> {
    const newTicket = new this.ticketModel({
      ...ticket,
      code: nanoid(8),
      purchase_date: Date.now(),
    });
    return newTicket.save();
  }

  async findAll(purchaser: string): Promise<Ticket[]> {
    return this.ticketModel.find({ purchaser }).exec();
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    purchaser: string,
  ): Promise<PaginationResponse<Ticket>> {
    const totalDocs = await this.ticketModel.countDocuments();
    const payload = await this.ticketModel
      .find({ purchaser })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalPages = Math.ceil(totalDocs / limit);
    const pagingCounter = (page - 1) * limit + 1;
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      payload,
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
    };
  }

  async findById(id: string): Promise<Ticket> {
    return this.ticketModel.findById(id).exec();
  }

  async update(id: string, ticket: Ticket): Promise<Ticket> {
    const updatedTicket = await this.ticketModel
      .findByIdAndUpdate(id, ticket, { new: true })
      .exec();
    if (!updatedTicket) {
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }
    return updatedTicket;
  }

  remove(id: string) {
    const result = this.ticketModel.deleteOne({ _id: id }).exec();

    if (!result) {
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }
  }
}
