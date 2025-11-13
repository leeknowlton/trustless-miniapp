import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgb(28, 28, 28)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Background watermark text */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            opacity: 0.06,
            fontSize: "24px",
            color: "rgb(238, 238, 238)",
            lineHeight: "2.2",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <div>
            We choose to build trustless systems even when it is harder.
          </div>
          <div>
            We pay the cost of openness over the convenience of control.
          </div>
          <div>
            We do not outsource neutrality to anyone who can be bribed, coerced,
            or shut down.
          </div>
          <div>
            We measure success not by transactions per second, but by trust
            reduced per transaction.
          </div>
          <div>We refuse to build on infrastructure we cannot replace.</div>
          <div>
            We refuse to call a system "permissionless" when only the privileged
            can participate.
          </div>
          <div>
            We refuse to trade autonomy for polish, or freedom for frictionless
            UX.
          </div>
          <div>
            Trustlessness is not preserved by consensus alone — it is preserved
            by resistance.
          </div>
          <div>
            If your protocol requires faith in an intermediary, change it.
          </div>
          <div>If it relies on a private gateway, replace it.</div>
          <div>If it hides critical state or logic offchain, expose it.</div>
          <div>
            In the end, the world does not need more efficient middlemen.
          </div>
          <div>It needs fewer reasons to trust them.</div>
        </div>

        {/* Top text: "I signed the" */}
        <div
          style={{
            position: "absolute",
            top: "200px",
            fontSize: "48px",
            color: "rgb(238, 238, 238)",
            fontWeight: "400",
            letterSpacing: "0.02em",
            display: "flex",
            zIndex: 1,
          }}
        >
          I signed the
        </div>

        {/* Middle text: "The Trustlessness Manifesto" */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "700",
            color: "rgb(238, 238, 238)",
            textAlign: "center",
            lineHeight: "1.2",
            marginBottom: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div>The Trustless Manifesto Pledge</div>
        </div>

        {/* Bottom text: Authors names */}
        <div
          style={{
            fontSize: "36px",
            color: "rgb(195, 165, 84)",
            textAlign: "center",
            marginTop: "20px",
            fontWeight: "500",
            display: "flex",
            zIndex: 1,
          }}
        >
          Authored by Yoav Weiss, Vitalik Buterin, Marissa Posner
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
    }
  );
}
