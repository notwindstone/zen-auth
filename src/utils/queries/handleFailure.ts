import { NO_RETRY_ERRORS } from "@/configs/constants";

export default function handleFailure(failureCount: number, error: Error): boolean {
    return !(NO_RETRY_ERRORS.has(Number(error.message)) || failureCount > 3);
}