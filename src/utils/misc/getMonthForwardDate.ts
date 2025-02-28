export function getMonthForwardDate(): Date {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
}