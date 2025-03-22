export default function handleTurnstileReset(id: string) {
    window?.turnstile?.reset(id);
}