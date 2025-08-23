export default function translateEmailStatus({
    status,
}: {
    status: "bounced" | "canceled" | "clicked" | "failed" | "complained" | "delivered" | "delivery_delayed" | "opened" | "queued" | "scheduled" | "sent" | undefined
}): string {
    switch (status) {
        case "bounced":
            return "Доставка не удалась";
        case "canceled":
            return "Отменено";
        case "clicked":
            return "Пройдено по ссылке";
        case "failed":
            return "Возникла непредвиденная ошибка";
        case "complained":
            return "Что-то пошло не так...";
        case "delivered":
            return "Доставлено";
        case "delivery_delayed":
            return "Доставка задержана";
        case "opened":
            return "Доставлено и прочтено";
        case "scheduled":
            return "Запланировано";
        case "queued":
            return "В очереди";
        case "sent":
            return "Отправлено";
        default:
            return "Неизвестно";
    }
}