import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduleDto } from '../dtos/schedule.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private readonly scheduleEndpoint = `${environment.apiUrl}/schedule`;

  constructor(private http: HttpClient) {}

  getSchedules(): Observable<ScheduleDto[]> {
    return this.http.get<ScheduleDto[]>(this.scheduleEndpoint);
  }

  getScheduleById(id: number): Observable<ScheduleDto> {
    return this.http.get<ScheduleDto>(`${this.scheduleEndpoint}/${id}`);
  }

  createSchedule(scheduleDto: ScheduleDto): Observable<ScheduleDto> {
    return this.http.post<ScheduleDto>(this.scheduleEndpoint, scheduleDto);
  }

  updateSchedule(id: number, scheduleDto: ScheduleDto): Observable<ScheduleDto> {
    return this.http.put<ScheduleDto>(`${this.scheduleEndpoint}/${id}`, scheduleDto);
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.delete<any>(`${this.scheduleEndpoint}/${id}`);
  }
}
