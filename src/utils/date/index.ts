import { DayjsInput } from 'utils/date/types';
import dayjs from 'dayjs';

export function addDays(list: DayjsInput[], days: number): string[] {
  return list.map((day) => reverseDash(dayjs(day).add(days, 'days')));
}

export function getCurrentDays(firstDay: DayjsInput, maxDays: number): string[] {
  const days: string[] = [];
  for (let x = 0; x < maxDays; x++) {
    days.push(reverseDash(dayjs(firstDay).add(x, 'days')));
  }
  return days;
}

export function reverseDash(date: DayjsInput): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function shortDate(date: DayjsInput): string {
  return dayjs(date).format('ddd MMM DD');
}

export function dayName(date: DayjsInput): string {
  return dayjs(date).format('dddd');
}
