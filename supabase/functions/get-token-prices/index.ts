import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TokenPrices {
  bnb: number;
  bocz: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching token prices...');

    // Fetch BNB price from CoinGecko
    const bnbResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
    );
    
    if (!bnbResponse.ok) {
      throw new Error(`BNB price fetch failed: ${bnbResponse.status}`);
    }
    
    const bnbData = await bnbResponse.json();
    const bnbPrice = bnbData?.binancecoin?.usd || 600; // Fallback to 600 if API fails

    console.log('BNB price:', bnbPrice);

    // Fetch BOCZ token price from CoinGecko using contract address
    const boczContractAddress = '0x701bE97c604A35aB7BCF6C75cA6de3aba0704444';
    const boczResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=${boczContractAddress}&vs_currencies=usd`
    );

    let boczPrice = 0;
    
    if (boczResponse.ok) {
      const boczData = await boczResponse.json();
      boczPrice = boczData?.[boczContractAddress.toLowerCase()]?.usd || 0;
      console.log('BOCZ price:', boczPrice);
    } else {
      console.warn('BOCZ price fetch failed, using 0 as fallback');
    }

    const prices: TokenPrices = {
      bnb: bnbPrice,
      bocz: boczPrice,
    };

    return new Response(
      JSON.stringify(prices),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching token prices:', error);
    
    // Return fallback prices on error
    const fallbackPrices: TokenPrices = {
      bnb: 600,
      bocz: 0,
    };

    return new Response(
      JSON.stringify(fallbackPrices),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});
