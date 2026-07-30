import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RecommendationItem } from "@/lib/recommendations";

const currencyFormatter = new Intl.NumberFormat("ko-KR");

function formatWon(value: number | null): string {
  if (value === null) return "정보 없음";
  return `${currencyFormatter.format(value)}원`;
}

function formatDday(end: string): { label: string; urgent: boolean } {
  const endDate = new Date(end);
  if (Number.isNaN(endDate.getTime())) {
    return { label: "마감일 정보 없음", urgent: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (endDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (diffDays < 0) return { label: "마감", urgent: false };
  if (diffDays === 0) return { label: "오늘 마감", urgent: true };
  return { label: `D-${diffDays}`, urgent: diffDays <= 3 };
}

export function RecommendationCard({ item }: { item: RecommendationItem }) {
  const [expanded, setExpanded] = useState(false);
  const { product } = item;
  const dday = formatDday(product.apply_period.end);

  const rateSummary =
    product.rate_info.raw_text ||
    [
      product.rate_info.base_rate !== null && `기준 ${product.rate_info.base_rate}%`,
      product.rate_info.preferential_rate !== null &&
        `우대 ${product.rate_info.preferential_rate}%`,
      product.rate_info.is_variable && "변동금리",
    ]
      .filter(Boolean)
      .join(" · ") ||
    "정보 없음";

  const repaymentSummary =
    [
      product.repayment_term.grace_period_years !== null &&
        `거치 ${product.repayment_term.grace_period_years}년`,
      product.repayment_term.repayment_period_years !== null &&
        `상환 ${product.repayment_term.repayment_period_years}년`,
      product.repayment_term.method !== "unknown" && product.repayment_term.method,
    ]
      .filter(Boolean)
      .join(" · ") || "정보 없음";

  const targetSummary =
    [...product.target.region, ...product.target.industry].join(", ") || "전체";

  return (
    <Card variant="white" className="flex flex-col gap-4 p-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-kb-surface-secondary px-2 py-0.5 text-xs text-kb-gray">
            {product.category}
          </span>
          {item.isFallbackAlternative && (
            <span className="rounded-full border border-kb-border-strong px-2 py-0.5 text-xs text-kb-mid-tone">
              대안 추천
            </span>
          )}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              dday.urgent
                ? "bg-kb-yellow-negative text-kb-gray"
                : "border border-kb-surface-secondary bg-kb-background-soft text-kb-mid-tone",
            )}>
            {dday.label}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-kb-gray">
          {product.product_name}
        </h3>
        <p className="text-sm text-kb-mid-tone">{product.provider}</p>
      </div>

      <p className="rounded-md bg-kb-background-soft px-3 py-2 text-sm text-kb-gray">
        {item.explanation}
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-kb-gray">
        <span>한도 {formatWon(product.limit_amount.max)}</span>
        <span>
          {item.monthlyPayment.monthlyAmount !== null
            ? `월 상환 예상 ${formatWon(item.monthlyPayment.monthlyAmount)}`
            : item.monthlyPayment.label}
        </span>
        <span>우대조건 {item.preferentialCount}개 충족</span>
      </div>

      {item.creditScoreVerificationNeeded && (
        <p className="text-xs text-kb-yellow-positive-hover">
          신용점수 확인이 필요한 상품입니다.
        </p>
      )}
      {item.isFallbackAlternative && item.fallbackReason && (
        <p className="text-xs text-kb-mid-tone">
          대안 추천 사유: {item.fallbackReason}
        </p>
      )}

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center gap-1 self-start text-sm font-medium text-kb-gray hover:text-kb-yellow-positive-hover">
        상세 조건
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <div className="flex flex-col gap-4 border-t border-kb-surface-secondary pt-4 text-sm text-kb-gray">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="font-medium">금리</p>
              <p className="text-kb-mid-tone">{rateSummary}</p>
            </div>
            <div>
              <p className="font-medium">상환 조건</p>
              <p className="text-kb-mid-tone">{repaymentSummary}</p>
            </div>
            <div>
              <p className="font-medium">지원 대상</p>
              <p className="text-kb-mid-tone">{targetSummary}</p>
            </div>
            {product.target.preferential_tags.length > 0 && (
              <div>
                <p className="font-medium">우대 조건</p>
                <p className="text-kb-mid-tone">
                  {product.target.preferential_tags.join(", ")}
                </p>
              </div>
            )}
            {product.required_documents && product.required_documents.length > 0 && (
              <div>
                <p className="font-medium">필요 서류</p>
                <ul className="list-inside list-disc text-kb-mid-tone">
                  {product.required_documents.map((doc, index) => (
                    <li key={`${doc}-${index}`}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}
            {product.application_steps && product.application_steps.length > 0 && (
              <div>
                <p className="font-medium">신청 절차</p>
                <ul className="list-inside list-decimal text-kb-mid-tone">
                  {product.application_steps.map((step, index) => (
                    <li key={`${step}-${index}`}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-kb-background-soft p-3">
            <p className="text-kb-mid-tone">{product.apply_method.description}</p>
            {product.apply_method.url && (
              <a
                href={product.apply_method.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-kb-gray hover:text-kb-yellow-positive-hover">
                신청하러 가기
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <p className="text-xs text-kb-light-tone-2">
            최종 업데이트{" "}
            {new Date(product.last_updated).toLocaleDateString("ko-KR")}
          </p>
        </div>
      )}
    </Card>
  );
}
