# Google Calendar Meeting Scheduling Setup Guide

## Overview

This portfolio now integrates Google Calendar's appointment scheduling feature, allowing visitors to book meetings directly without backend dependencies. The system uses Google Calendar's public booking links.

## Files Modified

1. **`client/src/components/meeting/GoogleCalendarBooking.jsx`** - New component for Google Calendar booking
2. **`client/src/components/portfolio/ContactSection.jsx`** - Updated to use Google Calendar booking
3. **`client/src/components/meeting/MeetingForm.jsx`** - Modified as fallback option
4. **`client/src/components/admin/MeetingManagement.jsx`** - Updated with Google Calendar note

## Configuration Steps

### Step 1: Create Google Calendar Appointment Schedule

1. **Open Google Calendar** → Go to [calendar.google.com](https://calendar.google.com)
2. **Click the gear icon** → Settings
3. **Navigate to "Appointment schedules"** in the left sidebar
4. **Click "Create new appointment schedule"**
5. **Configure your schedule**:
   - **Name**: "Portfolio Meetings" or similar
   - **Duration**: Set meeting duration (e.g., 30 or 60 minutes)
   - **General availability**: Set your working hours
   - **Scheduling window**: How far in advance people can book
   - **Buffer time**: Add time between meetings if needed

### Step 2: Configure Booking Page

1. **On the appointment schedule page**, click "Booking page"
2. **Customize the booking page**:
   - Title: "Schedule a meeting with [Your Name]"
   - Description: Brief welcome message
   - Logo: Optional
3. **Click "Save and publish"**

### Step 3: Get Your Booking Link

1. **On the booking page settings**, find "Booking page link"
2. **Copy the public URL** (starts with `https://calendar.google.com/calendar/u/0/appointments/schedules/`)
3. **Example**: `https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1CL2ECB7oAXHwYONVXn96N_HYhkZtDMeKvfKOROmUNgv6hgIrVzR7G_r8OprtloyyN8dCwLA0g`

### Step 4: Update Your Code

1. **Open the file**: `client/src/components/meeting/GoogleCalendarBooking.jsx`
2. **Find this line** (around line 30):
   ```javascript
   const GOOGLE_CALENDAR_BOOKING_URL = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1CL2ECB7oAXHwYONVXn96N_HYhkZtDMeKvfKOROmUNgv6hgIrVzR7G_r8OprtloyyN8dCwLA0g";
   ```
3. **Replace the URL** with your own Google Calendar booking link

4. **Also update** in `client/src/components/meeting/MeetingForm.jsx`:
   ```javascript
   const GOOGLE_CALENDAR_BOOKING_URL = "https://calendar.google.com/calendar/u/0/appointments/schedules/YOUR-ACTUAL-LINK-HERE";
   ```

## Features Provided

### ✅ Google Calendar Booking
- **Real-time availability**: Visitors see only available time slots
- **Automatic confirmations**: Google sends confirmation emails automatically
- **Google Meet integration**: Video meeting links generated automatically
- **Calendar invitations**: Added to both your and visitor's calendars
- **No backend required**: Works entirely through Google's infrastructure

### ✅ Fallback Form System
- **FormSubmit email integration**: Still works for form-based requests
- **Backend database storage**: Meeting requests still saved to database
- **Admin dashboard**: Can manage form-based requests
- **Backward compatibility**: Existing system remains functional

### ✅ Admin Dashboard Updates
- **Clear labeling**: Indicates Google Calendar integration
- **Fallback management**: Can still process form-based requests
- **Email notifications**: Works for fallback form requests

## Testing

### Test 1: Google Calendar Booking
1. Visit your portfolio
2. Click "Book via Google Calendar" in the contact section
3. Verify it opens your Google Calendar booking page
4. Try booking a test meeting (cancel immediately after)

### Test 2: Fallback Form
1. Visit portfolio → Contact section
2. Use the message form for general inquiries
3. Use meeting form (if available) as fallback option
4. Verify emails are sent via FormSubmit

### Test 3: Admin Dashboard
1. Log into admin dashboard
2. Check meeting management section
3. Verify Google Calendar integration note appears
4. Test accepting/rejecting form-based requests

## Troubleshooting

### Issue 1: Booking link doesn't work
- **Solution**: Verify your Google Calendar appointment schedule is published
- **Check**: Settings → Appointment schedules → Your schedule → "Booking page" → Ensure "Published" is enabled

### Issue 2: Visitors can't see available times
- **Solution**: Check your Google Calendar availability settings
- **Check**: Settings → Working hours and appointment slots availability

### Issue 3: Emails not being sent
- **Solution**: FormSubmit requires configuration
- **Check**: Visit [formsubmit.co](https://formsubmit.co) and ensure your email is verified

### Issue 4: Admin dashboard doesn't show meetings
- **Solution**: Backend needs to be running
- **Run**: `cd server && npm start` (if using local backend)

## Benefits

1. **Zero Backend Dependencies**: Google handles everything
2. **Professional Experience**: Google Calendar provides polished booking interface
3. **Automatic Notifications**: Google sends confirmations and reminders
4. **Time Zone Handling**: Automatic time zone conversion for international visitors
5. **Scalability**: No performance limits on your server
6. **Free**: Google Calendar appointment scheduling is free

## Security Notes

- **No sensitive data in frontend**: Only public booking URL
- **No backend exposure required**: Works with local-only backend
- **Google's security**: All booking data handled by Google's secure infrastructure
- **GDPR compliant**: Google handles data privacy and consent

## Future Enhancements

1. **Custom branding**: Google allows some customization of booking pages
2. **Multiple meeting types**: Different durations/types can be configured
3. **Buffer times**: Add time between meetings automatically
4. **Advanced scheduling**: Custom availability per day

## Support

For issues:
1. **Google Calendar setup**: Check Google Calendar Help
2. **Portfolio integration**: Verify booking URL is correct
3. **FormSubmit issues**: Check FormSubmit documentation

---

*This integration follows the architecture requirements: Frontend handles Google Calendar, backend remains local-only, FormSubmit handles emails.*