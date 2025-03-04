// Define TypeScript interface for API response


  export interface CryptoData {
    [key: string]: { usd: number };
  }
  
  export const fetchCryptoPrices = async (): Promise<CryptoData> => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,cardano,solana&vs_currencies=usd"
      );
  
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
      throw error; // Ensure React Query handles the error
    }
  };
  