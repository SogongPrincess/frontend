import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LocationRecommendationItem } from "@/lib/locationRecommendations";

const currencyFormatter = new Intl.NumberFormat("ko-KR");
const numberFormatter = new Intl.NumberFormat("ko-KR");

function formatWon(value: number): string {
  return `${currencyFormatter.format(Math.round(value))}원`;
}

function formatNumber(value: number): string {
  return numberFormatter.format(Math.round(value));
}

function formatScore(value: number): string {
  return value.toFixed(1);
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

const CLOSURE_RISK_LABEL: Record<string, string> = {
  LOW: "낮음",
  MEDIUM: "보통",
  HIGH: "높음",
};

const SCORE_ITEMS: { key: keyof LocationRecommendationItem["scores"]; label: string }[] = [
  { key: "demand", label: "수요" },
  { key: "competition", label: "경쟁" },
  { key: "profitability", label: "수익성" },
  { key: "stability", label: "안정성" },
  { key: "accessibility", label: "접근성" },
];

export function LocationRecommendationCard({
  item,
}: {
  item: LocationRecommendationItem;
}) {
  const [expanded, setExpanded] = useState(false);
  const closureRiskLabel =
    CLOSURE_RISK_LABEL[item.indicators.closure_risk_level] ??
    item.indicators.closure_risk_level;

  return (
    <Card variant="white" className="flex flex-col gap-4 p-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-kb-yellow-positive px-2 py-0.5 text-xs font-medium text-white">
            {item.rank}위
          </span>
          <span className="rounded-full bg-kb-surface-secondary px-2 py-0.5 text-xs text-kb-gray">
            {item.business_type}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              item.budget.satisfied
                ? "border border-kb-surface-secondary bg-kb-background-soft text-kb-mid-tone"
                : "bg-kb-yellow-negative text-kb-gray",
            )}>
            {item.budget.satisfied ? "예산 충족" : "예산 초과"}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-kb-gray">
          {item.area_name}
        </h3>
        <p className="text-sm text-kb-mid-tone">
          {item.location.district_name} {item.location.dong_name}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-kb-gray">
        <span className="font-medium">
          종합 점수 {formatScore(item.scores.final)}점
        </span>
        {SCORE_ITEMS.map((score) => (
          <span key={score.key} className="text-kb-mid-tone">
            {score.label} {formatScore(item.scores[score.key])}
          </span>
        ))}
      </div>

      {item.recommendation_reasons.length > 0 && (
        <ul className="flex flex-col gap-1 rounded-md bg-kb-background-soft px-3 py-2 text-sm text-kb-gray">
          {item.recommendation_reasons.map((reason, index) => (
            <li key={`${reason}-${index}`}>· {reason}</li>
          ))}
        </ul>
      )}

      {item.risk_factors.length > 0 && (
        <ul className="flex flex-col gap-1 text-xs text-kb-yellow-positive-hover">
          {item.risk_factors.map((risk, index) => (
            <li key={`${risk}-${index}`}>주의 · {risk}</li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center gap-1 self-start text-sm font-medium text-kb-gray hover:text-kb-yellow-positive-hover">
        상세 정보
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <div className="flex flex-col gap-4 border-t border-kb-surface-secondary pt-4 text-sm text-kb-gray">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="font-medium">예상 보증금</p>
              <p className="text-kb-mid-tone">
                {formatWon(item.budget.expected_deposit)}
              </p>
            </div>
            <div>
              <p className="font-medium">예상 월세</p>
              <p className="text-kb-mid-tone">
                {formatWon(item.budget.expected_monthly_rent)}
              </p>
            </div>
            <div>
              <p className="font-medium">예상 초기 투자금</p>
              <p className="text-kb-mid-tone">
                {formatWon(item.budget.estimated_initial_investment)}
              </p>
            </div>
            <div>
              <p className="font-medium">예산 잔여</p>
              <p className="text-kb-mid-tone">
                {formatWon(item.budget.remaining_budget)}
              </p>
            </div>
            <div>
              <p className="font-medium">예상 다음달 매출</p>
              <p className="text-kb-mid-tone">
                {formatWon(item.sales.predicted_next_monthly_sales_per_store)}
              </p>
            </div>
            <div>
              <p className="font-medium">매출 성장 추이</p>
              <p className="text-kb-mid-tone">
                {item.sales.recent_growth_trend} · 최근{" "}
                {formatPercent(item.sales.recent_growth_rate)} · 예측{" "}
                {formatPercent(item.sales.predicted_growth_rate)}
              </p>
            </div>
            <div>
              <p className="font-medium">경쟁 점포 수</p>
              <p className="text-kb-mid-tone">
                {formatNumber(item.indicators.competitor_count)}개
              </p>
            </div>
            <div>
              <p className="font-medium">폐업 위험도</p>
              <p className="text-kb-mid-tone">
                {closureRiskLabel} · 폐업률 {formatPercent(item.indicators.close_rate)}
              </p>
            </div>
            <div>
              <p className="font-medium">유동/거주/직장 인구</p>
              <p className="text-kb-mid-tone">
                {formatNumber(item.indicators.floating_population)} /{" "}
                {formatNumber(item.indicators.resident_population)} /{" "}
                {formatNumber(item.indicators.working_population)}
              </p>
            </div>
            <div>
              <p className="font-medium">지하철/버스 이용객</p>
              <p className="text-kb-mid-tone">
                {formatNumber(item.indicators.subway_passengers)} /{" "}
                {formatNumber(item.indicators.bus_passengers)}
              </p>
            </div>
          </div>

          {(item.data_quality.rent_is_fallback ||
            item.data_quality.deposit_is_fallback ||
            item.data_quality.missing_fields.length > 0) && (
            <p className="text-xs text-kb-light-tone-2">
              {item.data_quality.deposit_is_fallback && "보증금은 대체 데이터 기준입니다. "}
              {item.data_quality.rent_is_fallback && "월세는 대체 데이터 기준입니다. "}
              {item.data_quality.missing_fields.length > 0 &&
                `누락 항목: ${item.data_quality.missing_fields.join(", ")}`}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
