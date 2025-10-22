import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

const TOKENS_FILE_PATH = path.join(process.cwd(), "tokens", "tokens.json");

// GET: Read current tokens
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fileContent = await fs.readFile(TOKENS_FILE_PATH, "utf-8");
    const tokens = JSON.parse(fileContent);

    return NextResponse.json(tokens);
  } catch (error) {
    console.error("Error reading tokens:", error);
    return NextResponse.json(
      { error: "Failed to read tokens" },
      { status: 500 }
    );
  }
}

// POST: Update tokens
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin or designer role
    const userRole = (session.user as any)?.role;
    if (!userRole || !["admin", "designer"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // Validate the request body structure
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid token data" },
        { status: 400 }
      );
    }

    // Read current tokens to preserve structure
    const currentContent = await fs.readFile(TOKENS_FILE_PATH, "utf-8");
    const currentTokens = JSON.parse(currentContent);

    // Merge with new data, preserving metadata
    const updatedTokens = {
      ...currentTokens,
      ...body,
      meta: currentTokens.meta, // Preserve original meta
    };

    // Write back to file with pretty formatting
    await fs.writeFile(
      TOKENS_FILE_PATH,
      JSON.stringify(updatedTokens, null, 2),
      "utf-8"
    );

    return NextResponse.json({
      success: true,
      message: "Tokens updated successfully",
    });
  } catch (error) {
    console.error("Error updating tokens:", error);
    return NextResponse.json(
      { error: "Failed to update tokens" },
      { status: 500 }
    );
  }
}
