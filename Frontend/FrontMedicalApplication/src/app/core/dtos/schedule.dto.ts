export class ScheduleDto {
    scheduleId?: number; // Optional for creation
    doctorId: number;
    date: Date;
    startTime: string;
    endTime: string;
  
    constructor(
      doctorId: number,
      date: Date = new Date(),
      startTime: string = '',
      endTime: string = '',
      scheduleId?: number
    ) {
      this.doctorId = doctorId;
      this.date = date;
      this.startTime = startTime;
      this.endTime = endTime;
      if (scheduleId) {
        this.scheduleId = scheduleId;
      }
    }
  }
  