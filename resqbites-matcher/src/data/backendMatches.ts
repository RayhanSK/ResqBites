import data from "./frontend_matches.json";
export type DonationMatch = {
  donor_id: string;
  recipient_id: string;
  match_percentage: number;
  distance_km: number;
  food_category: string;
  quantity_kg: number;
  hours_to_expiry: number;
  priority: string;
  donor_lat: number;
  donor_lon: number;
  recipient_lat: number;
  recipient_lon: number;
};

export const backendMatches: DonationMatch[] = data;
