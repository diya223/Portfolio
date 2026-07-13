import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const supabase = createServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured. Add env variables to enable contact form." },
        { status: 503 }
      );
    }

    const { error } = await supabase.from("contact_messages").insert({
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
