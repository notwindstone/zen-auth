import { TableSessionType, TableUserType } from "@/db/schema";
import { API_ROUTES } from "@/configs/api";

export default async function querySessionCurrent(): Promise<{
    session: TableSessionType;
    user: TableUserType;
}> {
    const response = await fetch(API_ROUTES.SESSION.CURRENT);

    if (!response.ok) {
        return Promise.reject(
            new Error(
                response.status.toString(),
            ),
        );
    }

    return await response.json();
}