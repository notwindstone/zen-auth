export function getPlatformName(os: string): "windows" | "linux" | "mac" | "phone" | "unknown" {
    const platform = os.toLowerCase();
    switch (true) {
        case platform.includes('mac'):
            return "mac";
        case platform.includes('windows'):
            return "windows";
        case platform.includes('iphone'):
        case platform.includes('ipad'):
        case platform.includes('ios'):
        case platform.includes('android'):
            return "phone";
        case platform.includes('linux'):
            return "linux";
        default:
            return "unknown";
    }
}