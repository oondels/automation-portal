import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IntervalObject } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Parse PostgreSQL interval format and convert to days
 * Supports formats like: "30 days", "2 weeks", "3 months", "1 year"
 * @param interval PostgreSQL interval string
 * @returns number of days
 */
export function parseIntervalToDays(interval: string | IntervalObject): number {
  if (!interval) return 0;

  if (typeof interval === "object") {
    const {
      days = 0,
      weeks = 0,
      months = 0,
      years = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
    } = interval

    const daysFromTime = hours / 24 + minutes / 1440 + seconds / 86400
    return days + (weeks * 7) + (months * 30) + (years * 365) + daysFromTime
  }

  const intervalLower = String(interval).toLowerCase().trim();

  // Match patterns like "30 days", "2 weeks", etc.
  const match = intervalLower.match(/(\d+)\s*(day|days|week|weeks|month|months|year|years)/);
  if (!match) return 0;

  const value = parseInt(match[1]);
  const unit = match[2];
  switch (unit) {
    case 'day':
    case 'days':
      return value;
    case 'week':
    case 'weeks':
      return value * 7;
    case 'month':
    case 'months':
      return value * 30;
    case 'year':
    case 'years':
      return value * 365;
    default:
      return 0;
  }
}

/**
 * Calculate estimated end date based on start date and duration
 * @param startDate Start date string or Date
 * @param estimatedDurationTime PostgreSQL interval string or IntervalObject
 * @returns calculated end date
 */
export function calculateEstimatedEndDate(startDate: string | Date | undefined, estimatedDurationTime: string | IntervalObject | undefined): Date {
  if (!startDate || !estimatedDurationTime) {
    return new Date();
  }

  // Check if estimatedDurationTime is an empty object
  if (typeof estimatedDurationTime === 'object' && Object.keys(estimatedDurationTime).length === 0) {
    return new Date();
  }

  const start = new Date(startDate);
  const durationDays = parseIntervalToDays(estimatedDurationTime);

  const endDate = new Date(start);
  endDate.setDate(start.getDate() + durationDays);

  return endDate;
}

export function formateInterval(intervalo: IntervalObject): string {
  const partes: string[] = [];

  const unidades: { key: keyof IntervalObject; singular: string; plural: string }[] = [
    { key: "years", singular: "ano", plural: "anos" },
    { key: "months", singular: "mês", plural: "meses" },
    { key: "days", singular: "dia", plural: "dias" },
    { key: "hours", singular: "hora", plural: "horas" },
    { key: "minutes", singular: "minuto", plural: "minutos" },
    { key: "seconds", singular: "segundo", plural: "segundos" },
  ];

  for (const { key, singular, plural } of unidades) {
    const valor = intervalo[key];
    if (valor && valor > 0) {
      partes.push(`${valor} ${valor === 1 ? singular : plural}`);
    }
  }

  return partes.length > 0 ? partes.join(" e ") : "Não definido";
}