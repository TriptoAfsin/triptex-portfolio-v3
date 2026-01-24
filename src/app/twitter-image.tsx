import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Tripto Afsin - AI & Full-Stack Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(62, 207, 142, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
        }}
      >
        {/* Border glow effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #3ecf8e, #10b981, #34d399)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 80px",
          }}
        >
          {/* Name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              background: "linear-gradient(135deg, #3ecf8e, #34d399, #6ee7b7)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 16,
            }}
          >
            Tripto Afsin
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 36,
              color: "#ededed",
              marginBottom: 32,
              fontWeight: 500,
            }}
          >
            AI & Full-Stack Engineer
          </div>

          {/* Tags */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 40,
            }}
          >
            {["RAG Systems", "AI Agents", "Product Engineer", "TypeScript"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "rgba(62, 207, 142, 0.1)",
                    border: "1px solid rgba(62, 207, 142, 0.3)",
                    borderRadius: 9999,
                    color: "#3ecf8e",
                    fontSize: 20,
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>

          {/* Bio */}
          <div
            style={{
              fontSize: 24,
              color: "#a3a3a3",
              textAlign: "center",
              maxWidth: 800,
              lineHeight: 1.5,
            }}
          >
            Building intelligent web experiences with AI and modern technologies
          </div>

          {/* Website */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              fontSize: 20,
              color: "#525252",
            }}
          >
            triptex.me
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
