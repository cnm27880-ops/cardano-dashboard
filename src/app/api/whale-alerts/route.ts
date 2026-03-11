import { NextResponse } from 'next/server';

const BLOCKFROST_PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID;
const BLOCKFROST_API_URL = "https://cardano-mainnet.blockfrost.io/api/v0";
const WHALE_THRESHOLD_ADA = 1_000_000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lastHash = searchParams.get('lastHash');

  if (!BLOCKFROST_PROJECT_ID) {
    return NextResponse.json({ error: "Missing Blockfrost Project ID in environment" }, { status: 500 });
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

    const newWhaleTxs = [];

    // 3. For each tx, fetch its details to find large ADA transfers
    // Limit to first 20 txs to avoid hitting rate limits too fast
    const hashesToCheck = txHashes.slice(0, 20);

    for (const txHash of hashesToCheck) {
      try {
        const utxoRes = await fetch(`${BLOCKFROST_API_URL}/txs/${txHash}/utxos`, { headers });
        if (!utxoRes.ok) continue;
        const utxoData = await utxoRes.json();

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
      } catch (e) {
        console.error("Error fetching UTXO for tx", txHash, e);
      }
    }

    return NextResponse.json({ transactions: newWhaleTxs, latestHash: blockData.hash });
  } catch (error) {
    console.error("Error in whale-alerts API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
