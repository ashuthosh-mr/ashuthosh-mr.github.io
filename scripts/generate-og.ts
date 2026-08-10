import satori from "satori";
import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { jsx } from "react/jsx-runtime";
import { DATA } from "../src/data/resume";

async function generateOGImage() {
  const fontPath = join(process.cwd(), "public/fonts/CabinetGrotesk-Medium.ttf");
  const avatarFile = DATA.avatarUrl.replace(/^\//, "");
  const avatarPath = join(process.cwd(), "public", avatarFile);
  const resolvedAvatarPath = existsSync(avatarPath)
    ? avatarPath
    : (() => {
        const extensions = ["png", "jpg", "jpeg", "webp", "gif"];
        const base = avatarFile.replace(/\.[^.]+$/, "");
        for (const ext of extensions) {
          const p = join(process.cwd(), "public", `${base}.${ext}`);
          if (existsSync(p)) return p;
        }
        return null;
      })();
  const outputPath = join(process.cwd(), "public/og.png");

  const fontBuffer = readFileSync(fontPath);
  const fontData: ArrayBuffer = fontBuffer.buffer.slice(
    fontBuffer.byteOffset,
    fontBuffer.byteOffset + fontBuffer.byteLength
  );

  let avatarBuffer: Buffer | null = null;
  if (resolvedAvatarPath) {
    try {
      avatarBuffer = readFileSync(resolvedAvatarPath);
    } catch {
      console.log("Avatar not found at", resolvedAvatarPath);
    }
  } else {
    console.log("Avatar not found. Checked", avatarFile, "with common extensions");
  }

  const mimeType = resolvedAvatarPath?.match(/\.(jpg|jpeg)$/i)
    ? "image/jpeg"
    : "image/png";

  const svg = await satori(
    jsx("div", {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fafafa",
        padding: "80px",
      },
      children: [
        jsx(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              maxWidth: "700px",
            },
            children: [
              jsx(
                "div",
                {
                  style: {
                    fontFamily: "Cabinet Grotesk",
                    fontSize: "72px",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: "#000000",
                    letterSpacing: "-0.03em",
                  },
                  children: DATA.name,
                },
                "name"
              ),
              jsx(
                "div",
                {
                  style: {
                    fontFamily: "Cabinet Grotesk",
                    fontSize: "24px",
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: "#666666",
                    marginTop: "24px",
                    maxWidth: "600px",
                  },
                  children: DATA.description,
                },
                "description"
              ),
            ],
          },
          "left"
        ),
        avatarBuffer
          ? jsx(
              "img",
              {
                src: `data:${mimeType};base64,${avatarBuffer.toString("base64")}`,
                style: {
                  width: "240px",
                  height: "240px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "8px solid #ffffff",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                  flexShrink: 0,
                },
              },
              "avatar"
            )
          : null,
      ],
    }),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Cabinet Grotesk",
          data: fontData,
          weight: 700,
          style: "normal",
        },
        {
          name: "Cabinet Grotesk",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  console.log(`OG image generated: ${outputPath}`);
}

generateOGImage().catch((err) => {
  console.error("Failed to generate OG image:", err);
  process.exit(1);
});
