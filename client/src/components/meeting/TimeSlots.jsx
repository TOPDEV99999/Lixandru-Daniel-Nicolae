import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";

export const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
];

export function formatTimeSlot(time) {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
}

export default function TimeSlots({ selectedTime, onSelectTime, bookedSlots = [], dateSelected }) {
  if (!dateSelected) {
    return (
      <div className="glass rounded-2xl p-5 border border-border flex flex-col items-center justify-center min-h-[180px] text-center">
        <Clock className="w-8 h-8 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground font-medium">
          Select a date to view available time slots
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-primary" />
        <h4 className="font-heading font-semibold text-sm text-foreground">Available Times</h4>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {TIME_SLOTS.map((slot, i) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selectedTime === slot;
          return (
            <motion.button
              key={slot}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              disabled={isBooked}
              onClick={() => onSelectTime(slot)}
              className={`
                px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200
                ${isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : isBooked
                  ? "bg-muted/50 text-muted-foreground/40 border-border cursor-not-allowed line-through"
                  : "glass text-foreground border-border hover:border-primary/30 hover:bg-primary/5"
                }
              `}
            >
              {isBooked ? (
                <span className="flex items-center justify-center gap-1">
                  <X className="w-3 h-3" />
                  {formatTimeSlot(slot)}
                </span>
              ) : (
                formatTimeSlot(slot)
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}