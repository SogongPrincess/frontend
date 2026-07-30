import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export interface RecommendationRequest {
  trigger: {
    type: "onboarding_complete";
    userId: string;
  };
  profile: {
    biz_stage: string;
    industry: string[];
    region: string;
    needed_amount: number;
    self_capital: number;
    credit_score_range: {
      min: number;
      max: number;
    };
    has_debt: boolean;
    existing_loan_amount: number;
    collateral_available: boolean;
    monthly_repayment_capacity: number;
    biz_registration_status: string;
    preferential_tags: string[];
    completed_credit_education: boolean;
    existing_loan_rate: number;
    business_type: string;
    funding_purpose: string;
  };
  needed_amount: {
    market_analysis_estimate: {
      estimated_initial_cost: number;
    };
    user_reported_amount: number;
  };
  applied_product_names: string[];
}

export interface RecommendationProduct {
  id: string;
  source: string;
  product_name: string;
  category: string;
  provider: string;
  target: {
    region: string[];
    industry: string[];
    credit_tier: string | null;
    credit_score_max: number | null;
    revenue_size_max: number | null;
    biz_stage: string[];
    preferential_tags: string[];
    requires_credit_education: boolean;
  };
  limit_amount: {
    base: number | null;
    max: number | null;
    condition: string;
  };
  rate_info: {
    base_rate: number | null;
    add_rate_range: [number, number] | null;
    preferential_rate: number | null;
    is_variable: boolean;
    raw_text: string | null;
  };
  repayment_term: {
    grace_period_years: number | null;
    repayment_period_years: number | null;
    method: string;
  };
  apply_period: {
    start: string;
    end: string;
  };
  apply_method: {
    description: string;
    url: string;
  };
  required_documents: string[] | null;
  application_steps: string[] | null;
  alternate_apply_methods: unknown[] | null;
  merged_from: string[] | null;
  duplicate_restriction: string[];
  last_updated: string;
  freshness: string;
}

export interface RecommendationItem {
  product: RecommendationProduct;
  preferentialCount: number;
  explanation: string;
  isFallbackAlternative: boolean;
  fallbackReason: string | null;
  monthlyPayment: {
    monthlyAmount: number | null;
    label: string;
  };
  creditScoreVerificationNeeded: boolean;
}

export interface RecommendationsResponse {
  recommendations: RecommendationItem[];
}

export async function fetchRecommendations(
  payload: RecommendationRequest,
): Promise<RecommendationsResponse> {
  const { data } = await api.post<RecommendationsResponse>(
    "/recommendations",
    payload,
  );
  return data;
}

export function useRecommendationsMutation() {
  return useMutation({
    mutationFn: fetchRecommendations,
  });
}
