export function generateVerificationCode(): string {
    const randomSixDigitNumber = Math.floor(
        Math.pow(10, 5) + (Math.random() * 9 * Math.pow(10, 5)),
    );

    return randomSixDigitNumber.toString();
}