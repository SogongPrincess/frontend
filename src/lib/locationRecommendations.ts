import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export type PriorityCondition =
  | "sales"
  | "rent"
  | "accessibility"
  | "competition"
  | "stability";

export interface LocationRecommendationRequest {
  business_type: string;
  candidate_regions: string[];
  desired_area_m2: number;
  max_deposit: number;
  max_monthly_rent: number;
  priority_conditions: PriorityCondition[];
  top_n: number;
  total_budget: number;
}

export interface LocationRecommendationLocation {
  district_name: string;
  dong_name: string;
  latitude: number;
  longitude: number;
}

export interface LocationRecommendationScores {
  final: number;
  combined: number;
  rule: number;
  ml: number;
  affordability: number;
  demand: number;
  competition: number;
  profitability: number;
  stability: number;
  accessibility: number;
  priority: number;
}

export interface LocationRecommendationBudget {
  satisfied: boolean;
  expected_deposit: number;
  expected_monthly_rent: number;
  estimated_initial_investment: number;
  remaining_budget: number;
  deposit_source: string;
  rent_source: string;
  rent_reference_area_m2: number;
}

export interface LocationRecommendationSales {
  predicted_next_monthly_sales_per_store: number;
  predicted_growth_rate: number;
  ml_rent_burden_ratio: number;
  recent_growth_rate: number;
  recent_growth_trend: string;
}

export interface LocationRecommendationIndicators {
  competitor_count: number;
  floating_population: number;
  resident_population: number;
  working_population: number;
  subway_passengers: number;
  bus_passengers: number;
  close_rate: number;
  closure_risk_level: string;
}

export interface LocationRecommendationDataQuality {
  rent_is_fallback: boolean;
  deposit_is_fallback: boolean;
  missing_fields: string[];
}

export interface LocationRecommendationItem {
  rank: number;
  area_code: string;
  area_name: string;
  business_type: string;
  location: LocationRecommendationLocation;
  scores: LocationRecommendationScores;
  budget: LocationRecommendationBudget;
  sales: LocationRecommendationSales;
  indicators: LocationRecommendationIndicators;
  recommendation_reasons: string[];
  risk_factors: string[];
  data_quality: LocationRecommendationDataQuality;
}

export interface LocationRecommendationMetadata {
  analysis_quarter: string;
  data_mode: string;
  generated_at: string;
  candidate_count: number;
  eligible_count: number;
  data_sources: string[];
  model_metrics: Record<string, Record<string, number>>;
  requested_regions: string[];
  applied_priority_conditions: PriorityCondition[];
  notice: string;
}

export interface LocationRecommendationsResponse {
  recommendations: LocationRecommendationItem[];
  metadata: LocationRecommendationMetadata;
}

export async function fetchLocationRecommendations(
  payload: LocationRecommendationRequest,
): Promise<LocationRecommendationsResponse> {
  const { data } = await api.post<LocationRecommendationsResponse>(
    "/market-analysis/recommendations",
    payload,
  );
  return data;
}

export function useLocationRecommendationsMutation() {
  return useMutation({
    mutationFn: fetchLocationRecommendations,
  });
}
