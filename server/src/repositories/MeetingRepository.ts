import { BaseRepository } from './BaseRepository';
import { MeetingRequest } from '../generated/prisma';

export interface CreateMeetingRequestDto {
  customerName: string;
  email: string;
  company?: string;
  meetingTopic: string;
  requestedDate: string;
  requestedTime: string;
  notes?: string;
  visitorIp?: string;
  browser?: string;
  country?: string;
  userId?: string;
}

export interface UpdateMeetingRequestDto {
  status?: string;
  acceptedDate?: string;
  acceptedTime?: string;
  meetLink?: string;
  adminMessage?: string;
  adminNotes?: string;
  userId?: string;
}

export interface MeetingRepository extends BaseRepository<MeetingRequest, CreateMeetingRequestDto, UpdateMeetingRequestDto> {
  findByEmail(email: string): Promise<MeetingRequest[]>;
  findByStatus(status: string): Promise<MeetingRequest[]>;
  findByDateRange(startDate: string, endDate: string): Promise<MeetingRequest[]>;
  countByStatus(status: string): Promise<number>;
}