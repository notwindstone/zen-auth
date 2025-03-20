import { TableSessionType, TableUserType } from "@/db/schema";
import { API_ROUTES, API_STATUS_CODES } from "@/configs/api";

export default async function querySessionCurrent(): Promise<{
    session: TableSessionType;
    user: TableUserType;
} | number> {
    const response = await fetch(API_ROUTES.SESSION.CURRENT);

    if (!response.ok) {
        const { status } = response;

        if (status === API_STATUS_CODES.ERROR.UNAUTHORIZED) {
            return API_STATUS_CODES.ERROR.UNAUTHORIZED;
        }

        return Promise.reject(
            new Error(
                status.toString(),
            ),
        );
    }

    return await response.json();
}