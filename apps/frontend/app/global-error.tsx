"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    fontFamily: "system-ui, sans-serif",
                    padding: "2rem",
                    textAlign: "center",
                }}>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                        An unexpected error occurred. Please try again.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            padding: "0.5rem 1.5rem",
                            background: "#0070f3",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
