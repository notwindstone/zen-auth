/*
 * 1, 21, 31, ... ответ
 * 2, 3, 4, 22, 23, 24, 32, 33, 34 ... ответа
 * 5, 6, 7, 8, 9, 10-20, 25, 26, 27, 28, 29, 30, ... ответов
 */
export function makeWordEnding({
    count,
    wordTypes,
}: {
    count: number;
    wordTypes: [string, string, string];
}) {
    const twoToFour = [2, 3, 4];
    const tenToTwenty = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    // 1, 21, 31, ...
    const firstCase =
        count % 10 === 1 &&
        count !== 11;

    if (firstCase) {
        return wordTypes[0];
    }

    // 2, 3, 4, 22, 23, 24, 32, 33, 34, ...
    const secondCase =
        twoToFour.includes(count % 10) &&
        !tenToTwenty.includes(count);

    if (secondCase) {
        return wordTypes[1];
    }

    // 0, 5, 6, 7, 8, 9, 10-20, 25, 26, 27, 28, 29, 30
    return wordTypes[2];
}