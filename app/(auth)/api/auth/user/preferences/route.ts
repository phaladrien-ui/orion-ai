import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getUserPreference, setUserPreference } from "@/lib/db/queries";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 });
  }

  try {
    const value = await getUserPreference(session.user.id, key);
    return NextResponse.json({ key, value });
  } catch {
    // _error est intentionnellement ignoré
    return NextResponse.json(
      { error: "Failed to get preference" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key, value } = await req.json();

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    await setUserPreference(session.user.id, key, value);
    return NextResponse.json({ success: true });
  } catch {
    // _error est intentionnellement ignoré
    return NextResponse.json(
      { error: "Failed to set preference" },
      { status: 500 }
    );
  }
}
