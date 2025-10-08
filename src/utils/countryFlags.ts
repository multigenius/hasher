export const getCountryFlag = (countryName: string): string => {
  const countryToCode: Record<string, string> = {
    'United States': 'US',
    'United Kingdom': 'GB',
    'Australia': 'AU',
    'Canada': 'CA',
    'Germany': 'DE',
    'France': 'FR',
    'Netherlands': 'NL',
    'Singapore': 'SG',
    'Thailand': 'TH',
    'Malaysia': 'MY',
    'Indonesia': 'ID',
    'Philippines': 'PH',
    'Japan': 'JP',
    'South Korea': 'KR',
    'China': 'CN',
    'India': 'IN',
    'New Zealand': 'NZ',
    'Ireland': 'IE',
    'Spain': 'ES',
    'Italy': 'IT',
    'Belgium': 'BE',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Poland': 'PL',
    'Czech Republic': 'CZ',
    'Austria': 'AT',
    'Switzerland': 'CH',
    'Portugal': 'PT',
    'Mexico': 'MX',
    'Brazil': 'BR',
    'Argentina': 'AR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'South Africa': 'ZA',
    'Kenya': 'KE',
    'Egypt': 'EG',
    'UAE': 'AE',
  };

  const code = countryToCode[countryName];
  if (!code) return '🌍';

  return String.fromCodePoint(
    ...code.split('').map(char => 127397 + char.charCodeAt(0))
  );
};

export const getCountryCoordinates = (countryName: string): { lat: number; lng: number } => {
  const coordinates: Record<string, { lat: number; lng: number }> = {
    'United States': { lat: 37.0902, lng: -95.7129 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 },
    'Australia': { lat: -25.2744, lng: 133.7751 },
    'Canada': { lat: 56.1304, lng: -106.3468 },
    'Germany': { lat: 51.1657, lng: 10.4515 },
    'France': { lat: 46.2276, lng: 2.2137 },
    'Netherlands': { lat: 52.1326, lng: 5.2913 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
    'Thailand': { lat: 15.8700, lng: 100.9925 },
    'Malaysia': { lat: 4.2105, lng: 101.9758 },
    'Indonesia': { lat: -0.7893, lng: 113.9213 },
    'Philippines': { lat: 12.8797, lng: 121.7740 },
    'Japan': { lat: 36.2048, lng: 138.2529 },
    'South Korea': { lat: 35.9078, lng: 127.7669 },
    'China': { lat: 35.8617, lng: 104.1954 },
    'India': { lat: 20.5937, lng: 78.9629 },
    'New Zealand': { lat: -40.9006, lng: 174.8860 },
    'Ireland': { lat: 53.4129, lng: -8.2439 },
    'Spain': { lat: 40.4637, lng: -3.7492 },
    'Italy': { lat: 41.8719, lng: 12.5674 },
  };

  return coordinates[countryName] || { lat: 0, lng: 0 };
};
