import { BaseRepository } from './BaseRepository';
import { Visitor } from '../generated/prisma';
export interface CreateVisitorDto {
    visitorId: string;
    email?: string;
    name?: string;
    country?: string;
    browser?: string;
    device?: string;
    os?: string;
    visitorIp?: string;
}
export interface UpdateVisitorDto {
    visitCount?: number;
    email?: string;
    name?: string;
    country?: string;
    browser?: string;
    device?: string;
    os?: string;
    visitorIp?: string;
}
export interface VisitorRepository extends BaseRepository<Visitor, CreateVisitorDto, UpdateVisitorDto> {
    findByVisitorId(visitorId: string): Promise<Visitor | null>;
    incrementVisitCount(visitorId: string): Promise<Visitor>;
    findByCountry(country: string): Promise<Visitor[]>;
    getAnalytics(startDate: Date, endDate: Date): Promise<{
        totalVisits: number;
        uniqueVisitors: number;
        topCountries: Array<{
            country: string;
            count: number;
        }>;
        browserStats: Array<{
            browser: string;
            count: number;
        }>;
    }>;
}
//# sourceMappingURL=VisitorRepository.d.ts.map