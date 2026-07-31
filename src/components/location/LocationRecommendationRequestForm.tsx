import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { LocationRecommendationCard } from "@/components/location/LocationRecommendationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useLocationRecommendationsMutation,
  type LocationRecommendationRequest,
  type LocationRecommendationsResponse,
  type PriorityCondition,
} from "@/lib/locationRecommendations";

const BUSINESS_TYPE_OPTIONS = ["주점", "카페", "한식"];

const PRIORITY_CONDITION_OPTIONS: { value: PriorityCondition; label: string }[] = [
  { value: "sales", label: "매출" },
  { value: "rent", label: "임대료" },
  { value: "accessibility", label: "접근성" },
  { value: "competition", label: "경쟁 강도" },
  { value: "stability", label: "안정성" },
];

function formatMoneyInput(raw: string): string {
  const digitsOnly = raw.replace(/[^0-9]/g, "");
  return digitsOnly === "" ? "" : Number(digitsOnly).toLocaleString("ko-KR");
}

function parseMoneyInput(value: string): number {
  const digitsOnly = value.replace(/[^0-9]/g, "");
  return digitsOnly === "" ? 0 : Number(digitsOnly);
}

// 입력값의 단위는 만원이므로 원 단위로 변환한다.
function toWon(value: string): number {
  return parseMoneyInput(value) * 10_000;
}

function formatKoreanWon(amount: number): string {
  if (amount === 0) return "0원";
  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);
  const rest = amount % 10_000;
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString("ko-KR")}억`);
  if (man > 0) parts.push(`${man.toLocaleString("ko-KR")}만`);
  if (rest > 0) parts.push(`${rest.toLocaleString("ko-KR")}`);
  return `${parts.join(" ")}원`;
}

function moneyHint(value: string): string | undefined {
  if (value.trim() === "") return undefined;
  return formatKoreanWon(toWon(value));
}

interface FormState {
  businessType: string;
  candidateRegions: string;
  desiredAreaM2: string;
  maxDeposit: string;
  maxMonthlyRent: string;
  totalBudget: string;
  priorityConditions: PriorityCondition[];
  topN: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  businessType: "",
  candidateRegions: "",
  desiredAreaM2: "",
  maxDeposit: "",
  maxMonthlyRent: "",
  totalBudget: "",
  priorityConditions: [],
  topN: "5",
};

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNumber(value: string): number {
  const normalized = value.replace(/,/g, "").trim();
  return normalized === "" ? 0 : Number(normalized);
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (form.businessType.trim() === "") {
    errors.businessType = "필수 입력 항목입니다.";
  }

  if (parseList(form.candidateRegions).length === 0) {
    errors.candidateRegions = "후보 지역을 1개 이상 입력해주세요.";
  }

  const numberFields: (keyof FormState)[] = [
    "desiredAreaM2",
    "maxDeposit",
    "maxMonthlyRent",
    "totalBudget",
    "topN",
  ];
  for (const key of numberFields) {
    const normalized = (form[key] as string).replace(/,/g, "").trim();
    if (normalized === "") {
      errors[key] = "필수 입력 항목입니다.";
    } else if (Number.isNaN(Number(normalized)) || Number(normalized) <= 0) {
      errors[key] = "0보다 큰 숫자를 입력해주세요.";
    }
  }

  if (form.priorityConditions.length === 0) {
    errors.priorityConditions = "우선순위 조건을 1개 이상 선택해주세요.";
  }

  return errors;
}

function buildPayload(form: FormState): LocationRecommendationRequest {
  return {
    business_type: form.businessType,
    candidate_regions: parseList(form.candidateRegions),
    desired_area_m2: toNumber(form.desiredAreaM2),
    max_deposit: toWon(form.maxDeposit),
    max_monthly_rent: toWon(form.maxMonthlyRent),
    priority_conditions: form.priorityConditions,
    top_n: toNumber(form.topN),
    total_budget: toWon(form.totalBudget),
  };
}

function Field({
  label,
  required,
  error,
  hint,
  children,
  as = "label",
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  as?: "label" | "div";
}) {
  const Wrapper = as;
  return (
    <Wrapper className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-kb-gray">
        {label}
        {required && <span className="ml-1 text-kb-yellow-positive-hover">*</span>}
      </span>
      {children}
      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : (
        hint && <span className="text-xs text-kb-mid-tone">{hint}</span>
      )}
    </Wrapper>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-kb-gray border-b border-kb-surface-secondary pb-2">
      {children}
    </h2>
  );
}

function PriorityChipGroup({
  selected,
  onToggle,
}: {
  selected: PriorityCondition[];
  onToggle: (value: PriorityCondition) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRIORITY_CONDITION_OPTIONS.map((option) => {
        const orderIndex = selected.indexOf(option.value);
        const isSelected = orderIndex !== -1;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onToggle(option.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
              isSelected
                ? "border-kb-yellow-positive bg-kb-yellow-positive text-white"
                : "border-kb-border-strong bg-kb-white text-kb-gray hover:bg-kb-background",
            )}>
            {isSelected && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-kb-white text-[10px] font-semibold text-kb-yellow-positive-hover">
                {orderIndex + 1}
              </span>
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function ResultsView({
  isPending,
  isError,
  data,
  onBack,
}: {
  isPending: boolean;
  isError: boolean;
  data: LocationRecommendationsResponse | undefined;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <SectionHeading>추천 결과</SectionHeading>
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          다시 입력하기
        </Button>
      </div>

      {isPending && (
        <div className="flex flex-col items-center gap-3 py-16 text-kb-mid-tone">
          <LoadingSpinner size="lg" />
          <p className="text-sm">최적의 입지를 분석하고 있어요...</p>
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-500">
          추천 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      {!isPending && !isError && data && (
        <>
          <p className="text-sm text-kb-mid-tone">
            후보 {data.metadata.candidate_count}곳 중 {data.metadata.eligible_count}곳이
            조건에 적합해요. (분석 기준: {data.metadata.analysis_quarter})
            {data.metadata.notice && ` · ${data.metadata.notice}`}
          </p>
          {data.recommendations.length === 0 ? (
            <p className="text-sm text-kb-mid-tone">
              조건에 맞는 추천 결과가 없습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {data.recommendations.map((item) => (
                <LocationRecommendationCard
                  key={`${item.area_code}-${item.rank}`}
                  item={item}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function LocationRecommendationRequestForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const locationRecommendationsMutation = useLocationRecommendationsMutation();

  const handleChange =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = e.target;
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleMoneyChange =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = formatMoneyInput(e.target.value);
      setForm((prev) => ({ ...prev, [key]: formatted }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const togglePriorityCondition = (value: PriorityCondition) => {
    setForm((prev) => ({
      ...prev,
      priorityConditions: prev.priorityConditions.includes(value)
        ? prev.priorityConditions.filter((item) => item !== value)
        : [...prev.priorityConditions, value],
    }));
    setErrors((prev) => ({ ...prev, priorityConditions: undefined }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = buildPayload(form);
    setSubmitted(true);
    locationRecommendationsMutation.mutate(payload);
  };

  const handleBack = () => {
    setSubmitted(false);
    locationRecommendationsMutation.reset();
  };

  if (submitted) {
    return (
      <ResultsView
        isPending={locationRecommendationsMutation.isPending}
        isError={locationRecommendationsMutation.isError}
        data={locationRecommendationsMutation.data}
        onBack={handleBack}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <SectionHeading>기본 정보</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="업종" required error={errors.businessType}>
            <Select
              value={form.businessType}
              onChange={handleChange("businessType")}
            >
              <option value="" disabled>
                선택해주세요
              </option>
              {BUSINESS_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="후보 지역"
            required
            error={errors.candidateRegions}
            hint="쉼표(,)로 구분해 입력"
          >
            <Input
              value={form.candidateRegions}
              onChange={handleChange("candidateRegions")}
              placeholder="예: 노원구, 도봉구"
            />
          </Field>
          <Field label="희망 면적 (㎡)" required error={errors.desiredAreaM2}>
            <Input
              inputMode="numeric"
              value={form.desiredAreaM2}
              onChange={handleChange("desiredAreaM2")}
              placeholder="예: 66"
            />
          </Field>
          <Field label="추천 개수" required error={errors.topN}>
            <Input
              inputMode="numeric"
              value={form.topN}
              onChange={handleChange("topN")}
              placeholder="예: 5"
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeading>예산 정보</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="최대 보증금 (만원)"
            required
            error={errors.maxDeposit}
            hint={moneyHint(form.maxDeposit)}
          >
            <Input
              inputMode="numeric"
              value={form.maxDeposit}
              onChange={handleMoneyChange("maxDeposit")}
              placeholder="예: 5,000"
            />
          </Field>
          <Field
            label="최대 월세 (만원)"
            required
            error={errors.maxMonthlyRent}
            hint={moneyHint(form.maxMonthlyRent)}
          >
            <Input
              inputMode="numeric"
              value={form.maxMonthlyRent}
              onChange={handleMoneyChange("maxMonthlyRent")}
              placeholder="예: 500"
            />
          </Field>
          <Field
            label="총 예산 (만원)"
            required
            error={errors.totalBudget}
            hint={moneyHint(form.totalBudget)}
          >
            <Input
              inputMode="numeric"
              value={form.totalBudget}
              onChange={handleMoneyChange("totalBudget")}
              placeholder="예: 17,000"
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeading>우선순위 조건</SectionHeading>
        <Field
          label="중요하게 볼 조건을 순서대로 선택해주세요"
          as="div"
          error={errors.priorityConditions}
          hint="선택한 순서가 우선순위가 됩니다"
        >
          <PriorityChipGroup
            selected={form.priorityConditions}
            onToggle={togglePriorityCondition}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <Button type="submit">추천받기</Button>
      </div>
    </form>
  );
}
