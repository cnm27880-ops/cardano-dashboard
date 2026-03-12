import { NextResponse } from 'next/server';

const BLOCKFROST_PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID;
const BLOCKFROST_API_URL = "https://cardano-mainnet.blockfrost.io/api/v0";
const WHALE_THRESHOLD_ADA = 1_000_000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lastHash = searchParams.get('lastHash');

  // If we don't have an API key, return mock data instead of crashing the frontend
  if (!BLOCKFROST_PROJECT_ID) {
    console.warn("Missing Blockfrost Project ID in environment. Using mock data.");

    // Generate some mock whale transactions for display purposes
    const mockTxs = [];
    const randomBuffer = new Uint8Array(1);
    crypto.getRandomValues(randomBuffer);

    if (randomBuffer[0] > 127) { // 50% chance to generate a transaction
        const chars = "abcdef0123456789";

        const randomHash = () => {
          const bytes = new Uint8Array(64);
          crypto.getRandomValues(bytes);
          return Array.from(bytes).map(b => chars[b % chars.length]).join("");
        };

        const randomAddr = () => {
          const bytes = new Uint8Array(58);
          crypto.getRandomValues(bytes);
          return `addr1${Array.from(bytes).map(b => chars[b % chars.length]).join("")}`;
        };

        const amountBuffer = new Uint32Array(1);
        crypto.getRandomValues(amountBuffer);
        const amount = (amountBuffer[0] % 40000000) + 1000000;

        mockTxs.push({
            id: `mock-${Date.now()}`,
            txHash: randomHash(),
            amount: amount,
            timestamp: Date.now(),
            fromAddress: randomAddr(),
            toAddress: randomAddr(),
        });
    }

    return NextResponse.json({
        transactions: mockTxs,
        latestHash: `mock-hash-${Date.now()}`
    });
  }

  const headers = { project_id: BLOCKFROST_PROJECT_ID };

  try {
    // 1. Fetch the latest block
    const blockRes = await fetch(`${BLOCKFROST_API_URL}/blocks/latest`, { headers });
    if (!blockRes.ok) throw new Error("Failed to fetch latest block");
    const blockData = await blockRes.json();

    // If we've already processed this block, skip
    if (lastHash === blockData.hash) {
      return NextResponse.json({ transactions: [], latestHash: blockData.hash });
    }

    // 2. Fetch the transactions in the latest block
    const txsRes = await fetch(`${BLOCKFROST_API_URL}/blocks/${blockData.hash}/txs`, { headers });
    if (!txsRes.ok) throw new Error("Failed to fetch block txs");
    const txHashes: string[] = await txsRes.json();

    // 3. For each tx, fetch its details to find large ADA transfers
    // Limit to first 20 txs to avoid hitting rate limits too fast
    const hashesToCheck = txHashes.slice(0, 20);

    const utxoResults = await Promise.all(
      hashesToCheck.map(async (txHash) => {
        try {
          const utxoRes = await fetch(`${BLOCKFROST_API_URL}/txs/${txHash}/utxos`, { headers });
          if (!utxoRes.ok) return null;
          const utxoData = await utxoRes.json();
          return { txHash, utxoData };
        } catch (e) {
          console.error("Error fetching UTXO for tx", txHash, e);
          return null;
        }
      })
    );

    const newWhaleTxs = [];
    for (const result of utxoResults) {
      if (!result) continue;
      const { txHash, utxoData } = result;

      // Look for any output >= WHALE_THRESHOLD_ADA
      for (const output of utxoData.outputs) {
        const lovelaceAmount = output.amount.find((a: any) => a.unit === "lovelace");
        if (lovelaceAmount) {
          const adaAmount = parseInt(lovelaceAmount.quantity, 10) / 1_000_000;
          if (adaAmount >= WHALE_THRESHOLD_ADA) {
            newWhaleTxs.push({
              id: `${txHash}-${output.output_index}`,
              txHash: txHash,
              amount: adaAmount,
              timestamp: blockData.time * 1000,
              // Use the first input address as the sender (simplified)
              fromAddress: utxoData.inputs[0]?.address || "Unknown",
              toAddress: output.address,
            });
          }
        }
      }
    }

    return NextResponse.json({ transactions: newWhaleTxs, latestHash: blockData.hash });
  } catch (error) {
    console.error("Error in whale-alerts API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
