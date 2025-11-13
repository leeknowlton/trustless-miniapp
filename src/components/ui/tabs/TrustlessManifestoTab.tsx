"use client";

import { useCallback, useState } from "react";
import { useMiniApp } from "@neynar/react";
import {
  useAccount,
  useConnect,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from "wagmi";
import { mainnet } from "wagmi/chains";
import { config } from "../../providers/WagmiProvider";
import { renderError } from "../../../lib/errorUtils";
import { createPublicClient, http } from "viem";
import { sdk } from "@farcaster/miniapp-sdk";

// Trustless Manifesto contract ABI
const MANIFESTO_ABI = [
  {
    inputs: [],
    name: "pledge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "who", type: "address" }],
    name: "has_pledged",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const MANIFESTO_CONTRACT_ADDRESS =
  "0x32AA964746ba2be65C71fe4A5cB3c4a023cA3e20" as const;

/**
 * TrustlessManifestoTab component displays The Trustless Manifesto content.
 *
 * This component displays the full manifesto text and provides
 * a button for users to sign the manifesto on Ethereum mainnet.
 *
 * @example
 * ```tsx
 * <TrustlessManifestoTab />
 * ```
 */
export function TrustlessManifestoTab() {
  // Legacy alias for backwards compatibility
  return TrustlessManifestoTabContent();
}

export function HomeTab() {
  return TrustlessManifestoTabContent();
}

function TrustlessManifestoTabContent() {
  // --- Hooks ---
  const { context } = useMiniApp();
  const { isConnected, chainId, address } = useAccount();
  const { connectAsync } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const {
    writeContract,
    data: txHash,
    isPending: isSigningPending,
    error: signError,
    isError: isSignError,
  } = useWriteContract();
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const { isLoading: isWaitingForTx } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // --- Handlers ---
  const simulateTransaction = useCallback(async () => {
    if (!address) return false;

    try {
      setIsSimulating(true);
      setSimulationError(null);

      // Create a public client for the mainnet
      const client = createPublicClient({
        chain: mainnet,
        transport: http(),
      });

      // Simulate the contract call
      await client.simulateContract({
        account: address,
        address: MANIFESTO_CONTRACT_ADDRESS,
        abi: MANIFESTO_ABI,
        functionName: "pledge",
      });

      setIsSimulating(false);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error during simulation";
      setSimulationError(errorMessage);
      setIsSimulating(false);
      console.error("Simulation error:", error);
      return false;
    }
  }, [address]);

  const handleSign = useCallback(async () => {
    try {
      setSimulationError(null);

      // Only connect if not already connected
      if (!isConnected) {
        await connectAsync({
          chainId: mainnet.id,
          connector: config.connectors[0],
        });
      }

      // Switch to mainnet if not on mainnet - wait for this to complete
      if (chainId !== mainnet.id) {
        try {
          await switchChainAsync({ chainId: mainnet.id });
        } catch (switchError) {
          console.error("Chain switch failed:", switchError);
          setSimulationError(
            "Failed to switch to Ethereum mainnet. Please switch chains manually in your wallet."
          );
          return;
        }
      }

      // Add a small delay to ensure chain switch is propagated
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Run pre-flight simulation
      const simulationPassed = await simulateTransaction();
      if (!simulationPassed) {
        return;
      }

      // Call the pledge function
      writeContract({
        address: MANIFESTO_CONTRACT_ADDRESS,
        abi: MANIFESTO_ABI,
        functionName: "pledge",
        chainId: mainnet.id,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (!errorMessage.includes("already connected")) {
        setSimulationError(errorMessage);
        console.error("Error:", error);
      }
    }
  }, [
    isConnected,
    chainId,
    connectAsync,
    switchChainAsync,
    simulateTransaction,
    writeContract,
  ]);

  return (
    <div
      className="w-full min-h-screen text-white"
      style={{ backgroundColor: "rgb(28, 28, 28)" }}
    >
      <div className="max-w-2xl mx-auto px-6 py-12 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">The Trustless Manifesto</h1>
          <p className="text-xs font-semibold text-gray-100 mb-2">
            <strong>Authors:</strong> Yoav Weiss, Vitalik Buterin, Marissa
            Posner
          </p>
          <p className="text-xs text-gray-400 mb-2">
            <em>
              Special thanks to pcaversaccio, Tim Clancy, and Dror Tirosh for
              feedback and review.
            </em>
          </p>
          <p className="text-xs text-gray-400">
            <em>
              Original text at{" "}
              <a
                href="https://trustlessness.eth.limo/general/2025/11/11/the-trustless-manifesto.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "rgb(195, 165, 84)",
                  textDecoration: "underline",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
              >
                trustlessness.eth.limo
              </a>
              .
            </em>
          </p>
        </div>

        {/* Content */}
        <div className="max-w-none mb-12 text-base text-gray-100">
          <div
            className="my-8 border-t"
            style={{ borderColor: "rgb(128, 128, 128)" }}
          ></div>

          <section>
            <h2
              className="text-xl font-bold pb-2 mb-3"
              style={{ borderBottom: "1px solid rgb(238, 238, 238)" }}
            >
              I. Why trustlessness matters
            </h2>
            <div className="space-y-4">
              <p>
                Every system begins with good intentions.
                <br />
                A hosted node here, a whitelisted relayer there.
                <br />
                Each is harmless on its own — and together they become habit.
              </p>
              <p>
                Gateways become platforms.
                <br />
                Platforms become landlords.
                <br />
                Landlords decide who may enter and what they may do.
              </p>
              <p>
                The only defense is <em>trustless design</em>: systems whose
                correctness and fairness depend only on math and consensus,
                never on the goodwill of intermediaries.
              </p>
              <p>
                Trustlessness is not a feature to add after the fact.
                <br />
                It is <strong>the</strong> thing itself.
                <br />
                Without it, everything else — efficiency, UX, scalability — is
                decoration on a fragile core.
              </p>
              <p>
                Trustlessness is how credible neutrality is achieved.
                <br />
                Without it, the system becomes one that depends on
                intermediaries.
              </p>
            </div>
          </section>

          <div
            className="my-8 border-t"
            style={{ borderColor: "rgb(128, 128, 128)" }}
          ></div>

          <section>
            <h2
              className="text-xl font-bold pb-2 mb-6"
              style={{ borderBottom: "1px solid rgb(238, 238, 238)" }}
            >
              II. Why we build on Ethereum
            </h2>
            <div className="space-y-4">
              <p>
                We build on Ethereum because we choose verification over blind
                trust.
                <br />
                We write code so that power cannot hide behind policy.
                <br />
                We design protocols so that freedom does not depend on
                permission.
              </p>
              <p>
                Ethereum was not created to make finance efficient or apps
                convenient.
                <br />
                It was created to set people free — to empower anyone, anywhere
                to coordinate without permission and without trusting anyone
                they cannot hold accountable.
              </p>
              <p>
                Ethereum is the path to trustlessness.
                <br />
                That promise must not be lost as we scale.
              </p>
            </div>
          </section>

          <div
            className="my-8 border-t"
            style={{ borderColor: "rgb(128, 128, 128)" }}
          ></div>

          <section>
            <h2
              className="text-xl font-bold pb-2 mb-6"
              style={{ borderBottom: "1px solid rgb(238, 238, 238)" }}
            >
              III. What trustlessness means
            </h2>
            <div className="space-y-4">
              <p>
                A system is trustless when any honest participant can join,
                verify, and act{" "}
                <strong>without permission and without fear</strong>.
              </p>
              <p>This requires:</p>
              <ol className="list-decimal list-inside space-y-3 pl-4 ml-2">
                <li>
                  <strong>Self-sovereignty</strong> — each user authorizes their
                  own actions; no one acts on their behalf.
                </li>
                <li>
                  <strong>Verifiability</strong> — anyone can confirm what
                  happened from public data.
                </li>
                <li>
                  <strong>Censorship resistance</strong> — any valid action can
                  be included, within a reasonable timeframe and without undue
                  cost.
                </li>
                <li>
                  <strong>Walkaway test</strong> — if one operator disappears or
                  misbehaves, another can step in without approval.
                </li>
                <li>
                  <strong>Accessibility</strong> — participation must be within
                  reach of ordinary users, not only experts with servers and
                  capital.
                </li>
                <li>
                  <strong>Transparency of incentives</strong> — participants are
                  governed by protocol rules, not private contracts or opaque
                  APIs.
                </li>
              </ol>
              <p>
                Remove any of these, and the system drifts from protocol to
                platform — from neutral ground to private property.
              </p>
            </div>
          </section>

          <div
            className="my-8 border-t"
            style={{ borderColor: "rgb(128, 128, 128)" }}
          ></div>

          <section>
            <h2
              className="text-xl font-bold pb-2 mb-6"
              style={{ borderBottom: "1px solid rgb(238, 238, 238)" }}
            >
              IV. What trustlessness demands
            </h2>
            <div className="space-y-4">
              <p>
                Trustlessness is expensive.
                <br />
                It requires redundancy, openness, and complexity.
                <br />
                It requires mempools that anyone can use, even if that invites
                spam.
                <br />
                It requires clients that anyone can run, even if few will.
                <br />
                It requires governance that moves slowly, because no one can
                override consensus.
              </p>
              <p>
                Every shortcut that assumes trust eventually costs freedom.
                <br />
                Trustlessness depends on free open source software — not only
                code that can be read, but code that can be freely run,
                verified, and improved.
              </p>
              <p>A trustless design must therefore obey three laws:</p>
              <ol className="list-decimal list-inside space-y-3 pl-4 ml-2">
                <li>
                  <strong>No critical secrets.</strong>
                  <br />
                  No step of a protocol should depend on private information
                  held by a single actor — except the user themselves.
                </li>
                <li>
                  <strong>No indispensable intermediaries.</strong>
                  <br />
                  Anyone who forwards, executes, or attests must be replaceable
                  by any other participant following the same rules.
                  <br />
                  "Anyone can run one" is not enough — participation must be{" "}
                  <em>practically</em> open, not reserved for those with
                  servers, funding, and DevOps skills.
                  <br />A system that depends on intermediaries most users
                  cannot realistically replace is not trustless; it merely
                  concentrates trust in the hands of a smaller class of
                  operators.
                </li>
                <li>
                  <strong>No unverifiable outcomes.</strong>
                  <br />
                  Every effect on state must be reproducible and checkable from
                  public data.
                </li>
              </ol>
              <p>
                These laws are harsh. They limit what we can build easily.
                <br />
                But they are the only guarantee that what we build belongs to{" "}
                <strong>everyone</strong>.
              </p>
            </div>
          </section>

          <div
            className="my-8 border-t"
            style={{ borderColor: "rgb(128, 128, 128)" }}
          ></div>

          <section>
            <h2
              className="text-xl font-bold pb-2 mb-6"
              style={{ borderBottom: "1px solid rgb(238, 238, 238)" }}
            >
              V. The drift toward dependence on trust
            </h2>
            <div className="space-y-4">
              <p>
                The drift is not theoretical. It is already here.
                <br />
                Hosted RPCs are the default.
                <br />
                If AWS, GCP, and Cloudflare went dark, most apps would too.
                <br />
                Sequencing is centralized by design in many rollups.
                <br />
                Upgrade keys still exist. "Training wheels" are used as an
                excuse to delay decentralization.
                <br />
                "Self-custody" is delegated to CEXes.
                <br />
                Cross-chain interoperability has begun to mirror the very
                centralization it was meant to overcome — solvers and relayers
                act as gatekeepers of execution, deciding which transactions
                succeed and which fail.
              </p>
              <p>
                Trust does not return all at once.
                <br />
                It returns through defaults slowly.
                <br />
                Each choice feels harmless, temporary — not like centralization.
              </p>
              <p>
                No capture, no coup — just comfort.
                <br />
                Help becomes habit; habit becomes dependence.
                <br />
                Soon participation depends on infrastructure that only a few can
                run, and verification becomes the privilege of specialists.
              </p>
              <p>
                This is how decentralization erodes — not in theory, but in
                production.
                <br />
                Not tomorrow, but <strong>today</strong>.
              </p>
              <p>
                Decentralization erodes not through capture, but through
                convenience.
                <br />
                It drifts — automatically, continually — toward dependence on
                trust.
              </p>
            </div>
          </section>

          <div
            className="my-8 border-t"
            style={{ borderColor: "rgb(128, 128, 128)" }}
          ></div>

          <section>
            <h2
              className="text-xl font-bold pb-2 mb-6"
              style={{ borderBottom: "1px solid rgb(238, 238, 238)" }}
            >
              VI. The limits of delegation
            </h2>
            <div className="space-y-4">
              <p>
                Delegation may exist. Dependence must not.
                <br />
                Users may choose convenience — a hosted node, a friendly UI, a
                service that helps them — the protocol must never require it.
              </p>
              <p>
                If inclusion requires an intermediary, it is not trustless.
                <br />
                If that intermediary must be trusted, it is not neutral.
                <br />
                If users can "theoretically" run their own intermediary but in
                practice never will, the system has replaced permissionless
                access with <em>technical gatekeeping.</em>
              </p>
              <p>
                A permissionless protocol must not only be <em>open in code</em>
                , but <em>open in cost, accessibility, and comprehension.</em>
              </p>
              <p>
                We have seen this pattern before.
                <br />
                Email was once fully open — anyone could run their own
                mailserver.
                <br />
                In theory, you still can.
                <br />
                But in practice, spam filters, blocklists, and reputation
                systems make it nearly impossible for ordinary users.
                <br />
                Email became effectively centralized — not because the protocol
                was closed, but because{" "}
                <strong>practical trustlessness was lost</strong>.
              </p>
              <p>
                We must not let Ethereum's access layer follow the same path.
              </p>
            </div>
          </section>

          <div
            className="my-8 border-t"
            style={{ borderColor: "rgb(128, 128, 128)" }}
          ></div>

          <section>
            <h2
              className="text-xl font-bold pb-2 mb-6"
              style={{ borderBottom: "1px solid rgb(238, 238, 238)" }}
            >
              VII. The duty of builders
            </h2>
            <div className="space-y-4">
              <p>
                We who design protocols are stewards, not gatekeepers.
                <br />
                Our duty is not to build what is easiest, but what remains open
                and self-sovereign.
              </p>
              <p>
                When complexity tempts us to centralize, we must remember: every
                line of convenience code can become a choke point.
                <br />
                When critics ask why our designs are complicated, we should ask
                them what — or <strong>whom</strong> — they are trusting
                instead.
                <br />
                If simplicity comes from trust, it is not simplicity. It is
                surrender.
              </p>
              <p>
                Trustlessness costs computation, latency, and mental effort.
                <br />
                It buys resilience, longevity, neutrality, and freedom.
              </p>
              <p>
                Trustlessness also requires viable incentives.
                <br />
                Systems must reward those who sustain them without turning them
                into gatekeepers.
                <br />
                A protocol that relies on unpaid altruism will decay.
                <br />A protocol that rewards control will centralize.
                <br />
                The only stable equilibrium is one where neutrality is
                profitable.
              </p>
            </div>
          </section>

          <div
            className="my-8 border-t"
            style={{ borderColor: "rgb(128, 128, 128)" }}
          ></div>

          <section>
            <h2
              className="text-xl font-bold pb-2 mb-6"
              style={{ borderBottom: "1px solid rgb(238, 238, 238)" }}
            >
              VIII. The way forward
            </h2>
            <div className="space-y-4">
              <p>Ethereum has scaled — now it must stay honest.</p>
              <p>
                As we build new layers, new accounts, and new ways to interact,
                we must preserve the properties that made Ethereum matter:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Users initiate their own actions.</li>
                <li>Anyone can verify and participate.</li>
                <li>No one can be silently excluded.</li>
                <li>Logic lives in code, not in contracts of trust.</li>
                <li>
                  Inclusion depends on incentives, not on reputation or
                  permission.
                </li>
              </ul>
              <p>
                Trustlessness is not perfection.
                <br />
                It is a system that fails publicly, transparently, and
                recoverably — rather than privately and silently.
              </p>
            </div>
          </section>

          <div
            className="my-8 border-t"
            style={{ borderColor: "rgb(128, 128, 128)" }}
          ></div>

          <h2
            className="text-xl font-bold pb-2 mb-6"
            style={{ borderBottom: "1px solid rgb(238, 238, 238)" }}
          >
            IX. The pledge
          </h2>
          <div className="space-y-4">
            <p>
              We choose to build trustless systems even when it is harder.
              <br />
              We pay the cost of openness over the convenience of control.
              <br />
              We do not outsource neutrality to anyone who can be bribed,
              coerced, or shut down.
              <br />
              We measure success not by transactions per second, but by{" "}
              <strong>trust reduced per transaction</strong>.
            </p>
            <p>
              We refuse to build on infrastructure we cannot replace.
              <br />
              We refuse to call a system "permissionless" when only the
              privileged can participate.
              <br />
              We refuse to trade autonomy for polish, or freedom for
              frictionless UX.
              <br />
              Trustlessness is not preserved by consensus alone — it is
              preserved by resistance.
            </p>
            <p>
              If your protocol requires faith in an intermediary, change it.
              <br />
              If it relies on a private gateway, replace it.
              <br />
              If it hides critical state or logic offchain, expose it.
            </p>
            <p>
              In the end, the world does not need more efficient middlemen.
              <br />
              It needs fewer reasons to trust them.
            </p>
          </div>

          <div
            className="my-8 border-t"
            style={{ borderColor: "rgb(128, 128, 128)" }}
          ></div>

          <div className="space-y-2">
            <h4 className="font-bold text-xl">
              Trustlessness is the foundation.
            </h4>
            <p>Everything else is construction on top of it.</p>
            <p>The designs will change. The principles will not.</p>
          </div>

          <div
            className="my-8 border-t"
            style={{ borderColor: "rgb(128, 128, 128)" }}
          ></div>

          <section>
            <h2
              className="text-2xl font-bold pb-2 mb-6"
              style={{ borderBottom: "1px solid rgb(238, 238, 238)" }}
            >
              Sign the Trustless Manifesto
            </h2>
            <div className="space-y-4">
              <p>
                By signing this pledge, you affirm your commitment to building
                and using systems that preserve <strong>trustlessness</strong> —
                systems where correctness and fairness depend only on math and
                consensus, not intermediaries.
              </p>
              <p>
                Your signature will be recorded on Ethereum mainnet in the{" "}
                <a
                  href="https://etherscan.io/address/0x32aa964746ba2be65c71fe4a5cb3c4a023ca3e20"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "rgb(195, 165, 84)",
                    textDecoration: "underline",
                    fontWeight: "600",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.textDecoration = "none")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.textDecoration = "underline")
                  }
                >
                  Trustless Manifesto contract
                </a>
                .
              </p>
              <div className="mt-6">
                {txHash || true ? (
                  // Share button (showing now for debugging)
                  <button
                    onClick={async () => {
                      try {
                        const fid = context?.user?.fid;
                        const baseUrl = process.env.NEXT_PUBLIC_URL || typeof window !== 'undefined' ? window.location.origin : '';
                        const shareUrl = fid ? `${baseUrl}/share/${fid}` : baseUrl;

                        await sdk.actions.composeCast({
                          text: "Signed the trustless manifesto!",
                          embeds: [shareUrl],
                        });
                      } catch (error) {
                        console.error("Failed to open compose:", error);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      padding: "12px 24px",
                      marginTop: "16px",
                      fontSize: "14px",
                      fontWeight: "600",
                      letterSpacing: "0.03em",
                      border: "2px solid rgba(100, 200, 255, 0.7)",
                      borderRadius: "999px",
                      background:
                        "linear-gradient(135deg, rgba(100, 200, 255, 0.95), rgba(51, 170, 255, 0.85))",
                      color: "#001a33",
                      cursor: "pointer",
                      transition:
                        "transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                      textDecoration: "none",
                    }}
                  >
                    Share Your Signature
                  </button>
                ) : (
                  // Sign button
                  <button
                    onClick={handleSign}
                    disabled={isSigningPending || isWaitingForTx || isSimulating}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      padding: "12px 24px",
                      marginTop: "16px",
                      fontSize: "14px",
                      fontWeight: "600",
                      letterSpacing: "0.03em",
                      border: "2px solid rgba(255, 215, 64, 0.7)",
                      borderRadius: "999px",
                      background:
                        "linear-gradient(135deg, rgba(255, 215, 64, 0.95), rgba(255, 170, 51, 0.85))",
                      color: "#1b1300",
                      cursor:
                        isSigningPending || isWaitingForTx || isSimulating
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        isSigningPending || isWaitingForTx || isSimulating
                          ? 0.6
                          : 1,
                      transition:
                        "transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease, opacity 0.2s ease",
                      textDecoration: "none",
                    }}
                  >
                    {isSimulating
                      ? "Checking transaction..."
                      : isWaitingForTx
                      ? "Signing..."
                      : "Sign the Trustless Manifesto Pledge"}
                  </button>
                )}
              </div>
              {simulationError && (
                <div className="mt-4 text-sm text-red-400 bg-red-900/20 p-3 rounded">
                  <p className="font-semibold">Transaction would fail:</p>
                  <p className="text-xs mt-1 break-words">{simulationError}</p>
                </div>
              )}
              {isSignError && renderError(signError)}
              {txHash && (
                <div className="mt-4 text-sm text-green-400">
                  <p>Transaction submitted!</p>
                  <a
                    href={`https://etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    View on Etherscan
                  </a>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
