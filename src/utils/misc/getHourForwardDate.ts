export function getHourForwardDate(): Date {
    return new Date(Date.now() + 1000 * 60 * 60);
}