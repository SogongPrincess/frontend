import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { RecommendationCard } from "@/components/finance/RecommendationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useRecommendationsMutation,
  type BizRegistrationStatus,
  type BizStage,
  type BusinessType,
  type RecommendationRequest,
  type RecommendationsResponse,
} from "@/lib/recommendations";

const INDUSTRY_OPTIONS = ["카페", "베이커리", "식당"];

const PREFERENTIAL_TAG_OPTIONS = [
  "청년",
  "여성기업",
  "장애인기업",
  "사회적기업",
  "재창업",
  "저소득층",
  "다문화가정",
  "경력단절여성",
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

function moneyHint(value: string, extra?: string): string | undefined {
  if (value.trim() === "") return extra;
  const reading = formatKoreanWon(toWon(value));
  return extra ? `${reading} · ${extra}` : reading;
}

const KOREA_REGIONS = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

const BIZ_STAGE_OPTIONS: { value: BizStage; label: string }[] = [
  { value: "prep", label: "예비창업자" },
  { value: "early", label: "창업초기" },
  { value: "operating", label: "운영중" },
  { value: "crisis", label: "경영위기" },
  { value: "reboot", label: "재창업" },
];

const BIZ_REGISTRATION_STATUS_OPTIONS: {
  value: BizRegistrationStatus;
  label: string;
}[] = [
  { value: "continuing", label: "계속사업자" },
  { value: "closed", label: "폐업" },
  { value: "suspended", label: "휴업" },
  { value: "unknown", label: "알 수 없음" },
];

const CREDIT_SCORE_BUCKETS = {
  "900+": { min: 900, max: 1000 },
  "800-899": { min: 800, max: 899 },
  "700-799": { min: 700, max: 799 },
  unknown: null,
} as const satisfies Record<
  string,
  { min: number; max: number } | null
>;

type CreditScoreBucket = keyof typeof CREDIT_SCORE_BUCKETS;

const CREDIT_SCORE_BUCKET_OPTIONS: { value: CreditScoreBucket; label: string }[] =
  [
    { value: "900+", label: "900점 이상" },
    { value: "800-899", label: "800~899점" },
    { value: "700-799", label: "700~799점" },
    { value: "unknown", label: "잘 모르겠어요" },
  ];

interface FormState {
  userId: string;
  region: string;
  bizStage: string;
  bizRegistrationStatus: string;
  businessType: string;
  fundingPurpose: string;
  industry: string[];
  preferentialTags: string[];
  preferentialTagsOther: string;
  appliedProductNames: string;
  hasDebt: string;
  existingLoanAmount: string;
  existingLoanRate: string;
  collateralAvailable: string;
  completedCreditEducation: string;
  creditScoreBucket: CreditScoreBucket;
  neededAmount: string;
  selfCapital: string;
  monthlyRepaymentCapacity: string;
  estimatedInitialCost: string;
  userReportedAmount: string;
}

type StringFieldKey = {
  [K in keyof FormState]: FormState[K] extends string ? K : never;
}[keyof FormState];

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  userId: "",
  region: "",
  bizStage: "",
  bizRegistrationStatus: "",
  businessType: "",
  fundingPurpose: "",
  industry: [],
  preferentialTags: [],
  preferentialTagsOther: "",
  appliedProductNames: "",
  hasDebt: "false",
  existingLoanAmount: "",
  existingLoanRate: "",
  collateralAvailable: "false",
  completedCreditEducation: "false",
  creditScoreBucket: "unknown",
  neededAmount: "",
  selfCapital: "",
  monthlyRepaymentCapacity: "",
  estimatedInitialCost: "",
  userReportedAmount: "",
};

const REQUIRED_TEXT_FIELDS: StringFieldKey[] = [
  "userId",
  "region",
  "bizStage",
  "bizRegistrationStatus",
  "fundingPurpose",
];

const REQUIRED_NUMBER_FIELDS: StringFieldKey[] = [
  "neededAmount",
  "selfCapital",
  "monthlyRepaymentCapacity",
  "userReportedAmount",
];

const OPTIONAL_NUMBER_FIELDS: StringFieldKey[] = [
  "existingLoanAmount",
  "existingLoanRate",
  "estimatedInitialCost",
];

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

  for (const key of REQUIRED_TEXT_FIELDS) {
    if (form[key].trim() === "") {
      errors[key] = "필수 입력 항목입니다.";
    }
  }

  for (const key of REQUIRED_NUMBER_FIELDS) {
    const normalized = form[key].replace(/,/g, "").trim();
    if (normalized === "") {
      errors[key] = "필수 입력 항목입니다.";
    } else if (Number.isNaN(Number(normalized))) {
      errors[key] = "숫자만 입력해주세요.";
    }
  }

  for (const key of OPTIONAL_NUMBER_FIELDS) {
    const normalized = form[key].replace(/,/g, "").trim();
    if (normalized !== "" && Number.isNaN(Number(normalized))) {
      errors[key] = "숫자만 입력해주세요.";
    }
  }

  return errors;
}

function buildPayload(form: FormState): RecommendationRequest {
  return {
    trigger: {
      type: "onboarding_complete",
      userId: form.userId.trim(),
    },
    profile: {
      biz_stage: form.bizStage as BizStage,
      industry: form.industry,
      region: form.region.trim(),
      needed_amount: toWon(form.neededAmount),
      self_capital: toWon(form.selfCapital),
      credit_score_range: CREDIT_SCORE_BUCKETS[form.creditScoreBucket],
      has_debt: form.hasDebt === "true",
      existing_loan_amount: toWon(form.existingLoanAmount),
      collateral_available: form.collateralAvailable === "true",
      monthly_repayment_capacity: toWon(form.monthlyRepaymentCapacity),
      biz_registration_status: form.bizRegistrationStatus as BizRegistrationStatus,
      preferential_tags: [
        ...form.preferentialTags,
        ...parseList(form.preferentialTagsOther),
      ],
      completed_credit_education: form.completedCreditEducation === "true",
      existing_loan_rate: toNumber(form.existingLoanRate),
      business_type: (form.businessType === ""
        ? null
        : form.businessType) as BusinessType,
      funding_purpose: form.fundingPurpose.trim(),
    },
    needed_amount: {
      market_analysis_estimate: {
        estimated_initial_cost: toWon(form.estimatedInitialCost),
      },
      user_reported_amount: toWon(form.userReportedAmount),
    },
    applied_product_names: parseList(form.appliedProductNames),
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

function ToggleChipGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              isSelected
                ? "border-kb-yellow-positive bg-kb-yellow-positive text-white"
                : "border-kb-border-strong bg-kb-white text-kb-gray hover:bg-kb-background",
            )}>
            {option}
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
  data: RecommendationsResponse | undefined;
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
          <p className="text-sm">나에게 맞는 금융상품을 찾고 있어요...</p>
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-500">
          추천 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      {!isPending &&
        !isError &&
        data &&
        (data.recommendations.length === 0 ? (
          <p className="text-sm text-kb-mid-tone">
            조건에 맞는 추천 결과가 없습니다.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {data.recommendations.map((item) => (
              <RecommendationCard key={item.product.id} item={item} />
            ))}
          </div>
        ))}
    </div>
  );
}

export function RecommendationRequestForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const recommendationsMutation = useRecommendationsMutation();

  const handleChange =
    (key: StringFieldKey) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = e.target;
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleMoneyChange =
    (key: StringFieldKey) => (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = formatMoneyInput(e.target.value);
      setForm((prev) => ({ ...prev, [key]: formatted }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const toggleIndustry = (value: string) => {
    setForm((prev) => ({
      ...prev,
      industry: prev.industry.includes(value)
        ? prev.industry.filter((item) => item !== value)
        : [...prev.industry, value],
    }));
  };

  const togglePreferentialTag = (value: string) => {
    setForm((prev) => ({
      ...prev,
      preferentialTags: prev.preferentialTags.includes(value)
        ? prev.preferentialTags.filter((item) => item !== value)
        : [...prev.preferentialTags, value],
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = buildPayload(form);
    console.log("[recommendation payload]", payload);
    setSubmitted(true);
    recommendationsMutation.mutate(payload);
  };

  const handleBack = () => {
    setSubmitted(false);
    recommendationsMutation.reset();
  };

  if (submitted) {
    return (
      <ResultsView
        isPending={recommendationsMutation.isPending}
        isError={recommendationsMutation.isError}
        data={recommendationsMutation.data}
        onBack={handleBack}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <SectionHeading>기본 정보</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="사용자 ID" required error={errors.userId}>
            <Input
              value={form.userId}
              onChange={handleChange("userId")}
              placeholder="예: user-1234"
            />
          </Field>
          <Field label="지역" required error={errors.region}>
            <Select value={form.region} onChange={handleChange("region")}>
              <option value="" disabled>
                선택해주세요
              </option>
              {KOREA_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="사업 단계" required error={errors.bizStage}>
            <Select value={form.bizStage} onChange={handleChange("bizStage")}>
              <option value="" disabled>
                선택해주세요
              </option>
              {BIZ_STAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="사업자 등록 상태"
            required
            error={errors.bizRegistrationStatus}
          >
            <Select
              value={form.bizRegistrationStatus}
              onChange={handleChange("bizRegistrationStatus")}
            >
              <option value="" disabled>
                선택해주세요
              </option>
              {BIZ_REGISTRATION_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="사업자 유형" error={errors.businessType}>
            <Select
              value={form.businessType}
              onChange={handleChange("businessType")}
            >
              <option value="">선택 안 함</option>
              <option value="individual">개인사업자</option>
              <option value="corporation">법인</option>
            </Select>
          </Field>
          <Field label="자금 용도" required error={errors.fundingPurpose}>
            <Input
              value={form.fundingPurpose}
              onChange={handleChange("fundingPurpose")}
              placeholder="예: 시설자금"
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeading>산업 및 우대 정보</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="업종" as="div">
            <ToggleChipGroup
              options={INDUSTRY_OPTIONS}
              selected={form.industry}
              onToggle={toggleIndustry}
            />
          </Field>
          <Field
            label="기신청 상품명"
            hint="쉼표(,)로 구분해 입력"
            error={errors.appliedProductNames}
          >
            <Input
              value={form.appliedProductNames}
              onChange={handleChange("appliedProductNames")}
              placeholder="예: 청년창업대출"
            />
          </Field>
        </div>
        <Field label="우대 태그" as="div">
          <ToggleChipGroup
            options={PREFERENTIAL_TAG_OPTIONS}
            selected={form.preferentialTags}
            onToggle={togglePreferentialTag}
          />
        </Field>
        <Field
          label="기타 우대 태그"
          hint="목록에 없는 우대조건은 쉼표(,)로 구분해 직접 입력"
        >
          <Input
            value={form.preferentialTagsOther}
            onChange={handleChange("preferentialTagsOther")}
            placeholder="예: 장애인, 국가유공자"
          />
        </Field>
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeading>신용 및 부채 정보</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="신용점수">
            <Select
              value={form.creditScoreBucket}
              onChange={handleChange("creditScoreBucket")}
            >
              {CREDIT_SCORE_BUCKET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="기존 부채 보유 여부">
            <Select value={form.hasDebt} onChange={handleChange("hasDebt")}>
              <option value="false">없음</option>
              <option value="true">있음</option>
            </Select>
          </Field>
          <Field
            label="기존 대출 금액 (만원)"
            error={errors.existingLoanAmount}
            hint={moneyHint(form.existingLoanAmount)}
          >
            <Input
              inputMode="numeric"
              value={form.existingLoanAmount}
              onChange={handleMoneyChange("existingLoanAmount")}
              placeholder="예: 500"
            />
          </Field>
          <Field
            label="기존 대출 금리"
            error={errors.existingLoanRate}
            hint="% 단위"
          >
            <Input
              type="number"
              step="0.01"
              value={form.existingLoanRate}
              onChange={handleChange("existingLoanRate")}
              placeholder="예: 3.5"
            />
          </Field>
          <Field label="담보 제공 가능 여부">
            <Select
              value={form.collateralAvailable}
              onChange={handleChange("collateralAvailable")}
            >
              <option value="false">불가능</option>
              <option value="true">가능</option>
            </Select>
          </Field>
          <Field label="신용교육 이수 여부">
            <Select
              value={form.completedCreditEducation}
              onChange={handleChange("completedCreditEducation")}
            >
              <option value="false">미이수</option>
              <option value="true">이수</option>
            </Select>
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeading>자금 정보</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="필요 자금 (만원)"
            required
            error={errors.neededAmount}
            hint={moneyHint(form.neededAmount)}
          >
            <Input
              inputMode="numeric"
              value={form.neededAmount}
              onChange={handleMoneyChange("neededAmount")}
              placeholder="예: 3,000"
            />
          </Field>
          <Field
            label="자기 자본 (만원)"
            required
            error={errors.selfCapital}
            hint={moneyHint(form.selfCapital)}
          >
            <Input
              inputMode="numeric"
              value={form.selfCapital}
              onChange={handleMoneyChange("selfCapital")}
              placeholder="예: 1,000"
            />
          </Field>
          <Field
            label="월 상환 여력 (만원)"
            required
            error={errors.monthlyRepaymentCapacity}
            hint={moneyHint(form.monthlyRepaymentCapacity)}
          >
            <Input
              inputMode="numeric"
              value={form.monthlyRepaymentCapacity}
              onChange={handleMoneyChange("monthlyRepaymentCapacity")}
              placeholder="예: 50"
            />
          </Field>
          <Field
            label="시장 분석 추정 창업 비용 (만원)"
            error={errors.estimatedInitialCost}
            hint={moneyHint(form.estimatedInitialCost, "시장 분석 기반 추정치")}
          >
            <Input
              inputMode="numeric"
              value={form.estimatedInitialCost}
              onChange={handleMoneyChange("estimatedInitialCost")}
              placeholder="예: 2,500"
            />
          </Field>
          <Field
            label="사용자 입력 필요 자금 (만원)"
            required
            error={errors.userReportedAmount}
            hint={moneyHint(form.userReportedAmount, "사용자가 직접 입력한 금액")}
          >
            <Input
              inputMode="numeric"
              value={form.userReportedAmount}
              onChange={handleMoneyChange("userReportedAmount")}
              placeholder="예: 3,000"
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">추천받기</Button>
      </div>
    </form>
  );
}
