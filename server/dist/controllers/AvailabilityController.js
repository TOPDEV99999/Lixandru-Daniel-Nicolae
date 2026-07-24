"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityController = void 0;
const zod_1 = require("zod");
const availabilitySchema = zod_1.z.object({
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});
class AvailabilityController {
    meetingRepository;
    constructor(meetingRepository) {
        this.meetingRepository = meetingRepository;
    }
    async getAvailability(req, res) {
        try {
            // Validate input
            const validationResult = availabilitySchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validationResult.error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            const { date } = validationResult.data;
            // Get all meetings for the specified date
            const meetings = await this.meetingRepository.findByDateRange(date, date);
            // Filter for pending or accepted meetings
            const bookedMeetings = meetings.filter(meeting => ['pending', 'accepted'].includes(meeting.status));
            // Extract booked time slots
            const bookedSlots = bookedMeetings.map(meeting => meeting.requestedTime);
            // Define available time slots (9 AM to 5 PM in 30-minute intervals)
            const availableSlots = this.generateTimeSlots();
            const availableTimes = availableSlots.filter(slot => !bookedSlots.includes(slot));
            return res.status(200).json({
                date,
                bookedSlots,
                availableSlots: availableTimes,
                totalBooked: bookedSlots.length,
                totalAvailable: availableTimes.length
            });
        }
        catch (error) {
            console.error('Get availability error:', error);
            return res.status(500).json({
                error: 'Failed to get availability',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    async getWeeklyAvailability(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({
                    error: 'Both startDate and endDate query parameters are required'
                });
            }
            const start = String(startDate);
            const end = String(endDate);
            // Get meetings within date range
            const meetings = await this.meetingRepository.findByDateRange(start, end);
            // Filter for pending or accepted meetings
            const bookedMeetings = meetings.filter(meeting => ['pending', 'accepted'].includes(meeting.status));
            // Group by date
            const availabilityByDate = {};
            // Generate dates in range
            const startDateObj = new Date(start);
            const endDateObj = new Date(end);
            const currentDate = new Date(startDateObj);
            while (currentDate <= endDateObj) {
                const dateStr = currentDate.toISOString().split('T')[0];
                const dateMeetings = bookedMeetings.filter(meeting => meeting.requestedDate === dateStr);
                const bookedSlots = dateMeetings.map(meeting => meeting.requestedTime);
                const availableSlots = this.generateTimeSlots();
                const availableTimes = availableSlots.filter(slot => !bookedSlots.includes(slot));
                availabilityByDate[dateStr] = {
                    bookedSlots,
                    availableSlots: availableTimes,
                    totalBooked: bookedSlots.length,
                    totalAvailable: availableTimes.length
                };
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return res.status(200).json({
                startDate: start,
                endDate: end,
                availability: availabilityByDate,
                summary: {
                    totalDays: Object.keys(availabilityByDate).length,
                    totalBookedSlots: bookedMeetings.length,
                    averageDailyAvailability: this.calculateAverageAvailability(availabilityByDate)
                }
            });
        }
        catch (error) {
            console.error('Get weekly availability error:', error);
            return res.status(500).json({
                error: 'Failed to get weekly availability',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
    generateTimeSlots() {
        const slots = [];
        // Generate slots from 9:00 AM to 5:00 PM in 30-minute intervals
        for (let hour = 9; hour <= 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                // Skip 5:30 PM if hour is 17
                if (hour === 17 && minute === 30)
                    break;
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push(timeString);
            }
        }
        return slots;
    }
    calculateAverageAvailability(availabilityByDate) {
        const dates = Object.keys(availabilityByDate);
        if (dates.length === 0)
            return 0;
        const totalAvailable = dates.reduce((sum, date) => {
            return sum + availabilityByDate[date].totalAvailable;
        }, 0);
        return Math.round(totalAvailable / dates.length);
    }
}
exports.AvailabilityController = AvailabilityController;
//# sourceMappingURL=AvailabilityController.js.map