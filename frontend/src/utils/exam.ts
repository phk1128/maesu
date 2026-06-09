import type { School, ExamDdayInfo } from '../types';

export function examDdayInfo(school: School, now: number = Date.now()): ExamDdayInfo {
  const target = new Date(school.examDate).getTime();
  const diff = target - now;
  const totalSec = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const passed = diff <= 0;
  const d = new Date(school.examDate);
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return { days, hours, mins, secs, passed, dateStr, weekday, target };
}
