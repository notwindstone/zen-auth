export function getPlatformName(os: string): "windows" | "linux" | "mac" | "phone" | "unknown" {
    const platform = os.toLowerCase();
    switch (true) {
    // sorry for the 4 spaces instead of 8, eslint is going insane
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