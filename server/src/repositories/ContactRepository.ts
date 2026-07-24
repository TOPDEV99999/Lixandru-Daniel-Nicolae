import { BaseRepository } from './BaseRepository';
import { ContactMessage } from '../generated/prisma';

export interface CreateContactMessageDto {
  fullName: string;
  email: string;
  message: string;
  visitorIp?: string;
  browser?: string;
  country?: string;
  userId?: string;
}

export interface UpdateContactMessageDto {
  status?: string;
  userId?: string;
}

export interface ContactRepository extends BaseRepository<ContactMessage, CreateContactMessageDto, UpdateContactMessageDto> {
  findByEmail(email: string): Promise<ContactMessage[]>;
  findByStatus(status: string): Promise<ContactMessage[]>;
  countByStatus(status: string): Promise<number>;
}