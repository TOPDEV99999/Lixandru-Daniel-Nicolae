import { Response } from 'express';
import { VisitorRepository } from '../repositories/VisitorRepository';
import { MeetingRepository } from '../repositories/MeetingRepository';
import { ContactRepository } from '../repositories/ContactRepository';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AdminController {
  constructor(
    private visitorRepository: VisitorRepository,
    private meetingRepository: MeetingRepository,
    
    private contactRepository: ContactRepository,
    private userRepository: UserRepository
  ) {}

  async getAdminData(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      // Get recent data (last 500 records for each)
      const visitors = await this.visitorRepository.findAll();
      const meetings = await this.meetingRepository.findAll();
      const messages = await this.contactRepository.findAll();
      const users = await this.userRepository.findAll();

      // Calculate statistics
      const stats = {
        visitors: {
          total: visitors.length,
          uniqueCountries: new Set(visitors.map(v => v.country)).size,
          topBrowsers: this.getTopItems(visitors.map(v => v.browser)),
          visitTrend: this.calculateVisitTrend(visitors)
        },
        meetings: {
          total: meetings.length,
          byStatus: this.groupByStatus(meetings),
          upcoming: meetings.filter(m => m.status === 'pending' || m.status === 'accepted').length,
          recentActivity: this.getRecentActivity(meetings)
        },
        messages: {
          total: messages.length,
          byStatus: this.groupByStatus(messages),
          unread: messages.filter(m => m.status === 'new').length,
          responseRate: this.calculateResponseRate(messages)
        },
        users: {
          total: users.length,
          byRole: this.groupByRole(users),
          activeUsers: users.filter(u => {
            const lastActive = new Date(u.updatedAt);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return lastActive > thirtyDaysAgo;
          }).length
        },
        overview: {
          totalRecords: visitors.length + meetings.length + messages.length,
          growthRate: this.calculateGrowthRate(visitors, meetings, messages),
          engagementRate: this.calculateEngagementRate(visitors)
        }
      };

      // Get recent records for display
      const recentVisitors = visitors
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 10);
      
      const recentMeetings = meetings
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
      
      const recentMessages = messages
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

      return res.status(200).json({
        statistics: stats,
        recentData: {
          visitors: recentVisitors,
          meetings: recentMeetings,
          messages: recentMessages
        },
        summary: {
          totalVisitors: visitors.length,
          totalMeetings: meetings.length,
          totalMessages: messages.length,
          totalUsers: users.length,
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error: any) {
      console.error('Get admin data error:', error);
      return res.status(500).json({ error: 'Failed to get admin data' });
    }
  }

  async getDashboardStats(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { period = '30d' } = req.query;
      const periodStr = (Array.isArray(period) ? period[0] || '30d' : period) as string;
      const days = this.parsePeriod(periodStr);
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const visitors = await this.visitorRepository.findAll();
      const meetings = await this.meetingRepository.findAll();
      const messages = await this.contactRepository.findAll();

      // Filter data for the period
      const recentVisitors = visitors.filter(v => new Date(v.createdAt) > cutoffDate);
      const recentMeetings = meetings.filter(m => new Date(m.createdAt) > cutoffDate);
      const recentMessages = messages.filter(m => new Date(m.createdAt) > cutoffDate);

      const stats = {
        visitors: {
          total: recentVisitors.length,
          dailyAvg: recentVisitors.length / days,
          topCountries: this.getTopItems(recentVisitors.map(v => v.country), 5),
          browserDistribution: this.getTopItems(recentVisitors.map(v => v.browser), 3)
        },
        meetings: {
          total: recentMeetings.length,
          conversionRate: this.calculateMeetingConversionRate(recentMeetings),
          byTopic: this.getTopItems(recentMeetings.map(m => m.meetingTopic), 5),
          statusDistribution: this.groupByStatus(recentMeetings)
        },
        messages: {
          total: recentMessages.length,
          responseTime: this.calculateAverageResponseTime(recentMessages),
          byStatus: this.groupByStatus(recentMessages),
          topSenders: this.getTopItems(recentMessages.map(m => m.email), 5)
        },
        performance: {
          visitorToMeetingRate: recentMeetings.length / Math.max(recentVisitors.length, 1),
          meetingAcceptanceRate: recentMeetings.filter(m => m.status === 'accepted').length / Math.max(recentMeetings.length, 1),
          messageResponseRate: recentMessages.filter(m => m.status !== 'new').length / Math.max(recentMessages.length, 1)
        }
      };

      return res.status(200).json({
        period: {
          days,
          startDate: cutoffDate.toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        },
        stats
      });
    } catch (error: any) {
      console.error('Get dashboard stats error:', error);
      return res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
  }

  // Helper methods

  private getTopItems(items: (string | null)[], limit: number = 10): Array<{ item: string; count: number }> {
    const counts: Record<string, number> = {};
    
    items.forEach(item => {
      if (item) {
        counts[item] = (counts[item] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  private groupByStatus(items: Array<{ status: string }>): Record<string, number> {
    const groups: Record<string, number> = {};
    
    items.forEach(item => {
      const status = item.status || 'unknown';
      groups[status] = (groups[status] || 0) + 1;
    });

    return groups;
  }

  private groupByRole(users: Array<{ role: string }>): Record<string, number> {
    const groups: Record<string, number> = {};
    
    users.forEach(user => {
      const role = user.role || 'user';
      groups[role] = (groups[role] || 0) + 1;
    });

    return groups;
  }

  private calculateVisitTrend(visitors: Array<{ createdAt: Date }>): Array<{ date: string; count: number }> {
    const trend: Record<string, number> = {};
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    visitors.forEach(visitor => {
      const visitDate = new Date(visitor.createdAt);
      if (visitDate > sevenDaysAgo) {
        const dateKey = visitDate.toISOString().split('T')[0];
        trend[dateKey] = (trend[dateKey] || 0) + 1;
      }
    });

    // Fill in missing days
    const result: Array<{ date: string; count: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      result.push({
        date: dateKey,
        count: trend[dateKey] || 0
      });
    }

    return result;
  }

  private getRecentActivity(meetings: Array<{ createdAt: Date; status: string }>): Array<{ date: string; count: number; status: string }> {
    const activity: Array<{ date: string; count: number; status: string }> = [];
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const todayMeetings = meetings.filter(m => 
      new Date(m.createdAt).toISOString().split('T')[0] === today
    );
    const yesterdayMeetings = meetings.filter(m => 
      new Date(m.createdAt).toISOString().split('T')[0] === yesterday
    );

    activity.push({ date: today, count: todayMeetings.length, status: 'today' });
    activity.push({ date: yesterday, count: yesterdayMeetings.length, status: 'yesterday' });

    return activity;
  }

  private calculateResponseRate(messages: Array<{ status: string }>): number {
    const responded = messages.filter(m => m.status !== 'new').length;
    return messages.length > 0 ? Math.round((responded / messages.length) * 100) : 0;
  }

  private calculateGrowthRate(visitors: any[], meetings: any[], messages: any[]): number {
    // Simplified growth rate calculation
    const totalCurrent = visitors.length + meetings.length + messages.length;
    const totalPrevious = totalCurrent * 0.9; // Placeholder for previous period
    
    return totalPrevious > 0 ? Math.round(((totalCurrent - totalPrevious) / totalPrevious) * 100) : 100;
  }

  private calculateEngagementRate(visitors: any[]): number {
    const engagedVisitors = visitors.filter(v => v.visitCount > 1).length;
    return visitors.length > 0 ? Math.round((engagedVisitors / visitors.length) * 100) : 0;
  }

  private parsePeriod(period: string): number {
    const match = period.match(/^(\d+)([dwm])$/);
    if (!match) return 30; // Default to 30 days
    
    const [, value, unit] = match;
    const numValue = parseInt(value, 10);

    switch (unit) {
      case 'd': return numValue;
      case 'w': return numValue * 7;
      case 'm': return numValue * 30;
      default: return 30;
    }
  }

  private calculateMeetingConversionRate(meetings: Array<{ status: string }>): number {
    const accepted = meetings.filter(m => m.status === 'accepted').length;
    return meetings.length > 0 ? Math.round((accepted / meetings.length) * 100) : 0;
  }

  private calculateAverageResponseTime(messages: Array<{ createdAt: Date; updatedAt: Date; status: string }>): number {
    const respondedMessages = messages.filter(m => m.status !== 'new');
    if (respondedMessages.length === 0) return 0;

    const totalResponseTime = respondedMessages.reduce((sum, message) => {
      const responseTime = new Date(message.updatedAt).getTime() - new Date(message.createdAt).getTime();
      return sum + responseTime;
    }, 0);

    return Math.round(totalResponseTime / respondedMessages.length / (1000 * 60 * 60)); // Convert to hours
  }
}