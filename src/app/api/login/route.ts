import type { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<void> /* Promise<Response> */ {
    console.log(request);
}