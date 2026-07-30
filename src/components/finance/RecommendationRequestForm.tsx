import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { RecommendationCard } from "@/components/finance/RecommendationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Select } from "@/components/ui/select";
import {
  useRecommendationsMutation,
  type RecommendationRequest,
  type RecommendationsResponse,
} from "@/lib/recommendations";

interface FormState {
  userId: string;
  region: string;
  bizStage: string;
  bizRegistrationStatus: string;
  businessType: string;
  fundingPurpose: string;
  industry: string;
  preferentialTags: string;
  appliedProductNames: string;
  hasDebt: string;
  existingLoanAmount: string;
  existingLoanRate: string;
  collateralAvailable: string;
  completedCreditEducation: string;
  creditScoreMin: string;
  creditScoreMax: string;
  neededAmount: string;
  selfCapital: string;
  monthlyRepaymentCapacity: string;
  estimatedInitialCost: string;
  userReportedAmount: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  userId: "",
  region: "",
  bizStage: "",
  bizRegistrationStatus: "",
  businessType: "",
  fundingPurpose: "",
  industry: "",
  preferentialTags: "",
  appliedProductNames: "",
  hasDebt: "false",
  existingLoanAmount: "",
  existingLoanRate: "",
  collateralAvailable: "false",
  completedCreditEducation: "false",
  creditScoreMin: "",
  creditScoreMax: "",
  neededAmount: "",
  selfCapital: "",
  monthlyRepaymentCapacity: "",
  estimatedInitialCost: "",
  userReportedAmount: "",
};

const REQUIRED_TEXT_FIELDS: (keyof FormState)[] = [
  "userId",
  "region",
  "bizStage",
  "bizRegistrationStatus",
  "businessType",
  "fundingPurpose",
];

const REQUIRED_NUMBER_FIELDS: (keyof FormState)[] = [
  "creditScoreMin",
  "creditScoreMax",
  "neededAmount",
  "selfCapital",
  "monthlyRepaymentCapacity",
  "userReportedAmount",
];

const OPTIONAL_NUMBER_FIELDS: (keyof FormState)[] = [
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
  return value.trim() === "" ? 0 : Number(value);
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  for (const key of REQUIRED_TEXT_FIELDS) {
    if (form[key].trim() === "") {
      errors[key] = "필수 입력 항목입니다.";
    }
  }

  for (const key of REQUIRED_NUMBER_FIELDS) {
    if (form[key].trim() === "") {
      errors[key] = "필수 입력 항목입니다.";
    } else if (Number.isNaN(Number(form[key]))) {
      errors[key] = "숫자만 입력해주세요.";
    }
  }

  for (const key of OPTIONAL_NUMBER_FIELDS) {
    if (form[key].trim() !== "" && Number.isNaN(Number(form[key]))) {
      errors[key] = "숫자만 입력해주세요.";
    }
  }

  if (
    !errors.creditScoreMin &&
    !errors.creditScoreMax &&
    Number(form.creditScoreMin) > Number(form.creditScoreMax)
  ) {
    errors.creditScoreMax = "최댓값은 최솟값보다 작을 수 없습니다.";
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
      biz_stage: form.bizStage.trim(),
      industry: parseList(form.industry),
      region: form.region.trim(),
      needed_amount: toNumber(form.neededAmount),
      self_capital: toNumber(form.selfCapital),
      credit_score_range: {
        min: toNumber(form.creditScoreMin),
        max: toNumber(form.creditScoreMax),
      },
      has_debt: form.hasDebt === "true",
      existing_loan_amount: toNumber(form.existingLoanAmount),
      collateral_available: form.collateralAvailable === "true",
      monthly_repayment_capacity: toNumber(form.monthlyRepaymentCapacity),
      biz_registration_status: form.bizRegistrationStatus.trim(),
      preferential_tags: parseList(form.preferentialTags),
      completed_credit_education: form.completedCreditEducation === "true",
      existing_loan_rate: toNumber(form.existingLoanRate),
      business_type: form.businessType.trim(),
      funding_purpose: form.fundingPurpose.trim(),
    },
    needed_amount: {
      market_analysis_estimate: {
        estimated_initial_cost: toNumber(form.estimatedInitialCost),
      },
      user_reported_amount: toNumber(form.userReportedAmount),
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
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
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
    </label>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-kb-gray border-b border-kb-surface-secondary pb-2">
      {children}
    </h2>
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
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = e.target;
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
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
            <Input
              value={form.region}
              onChange={handleChange("region")}
              placeholder="예: 서울"
            />
          </Field>
          <Field label="사업 단계" required error={errors.bizStage}>
            <Input
              value={form.bizStage}
              onChange={handleChange("bizStage")}
              placeholder="예: prep"
            />
          </Field>
          <Field
            label="사업자 등록 상태"
            required
            error={errors.bizRegistrationStatus}
          >
            <Input
              value={form.bizRegistrationStatus}
              onChange={handleChange("bizRegistrationStatus")}
              placeholder="예: continuing"
            />
          </Field>
          <Field label="사업자 유형" required error={errors.businessType}>
            <Input
              value={form.businessType}
              onChange={handleChange("businessType")}
              placeholder="예: individual"
            />
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
          <Field label="업종" hint="쉼표(,)로 구분해 입력">
            <Input
              value={form.industry}
              onChange={handleChange("industry")}
              placeholder="예: IT, 요식업"
            />
          </Field>
          <Field label="우대 태그" hint="쉼표(,)로 구분해 입력">
            <Input
              value={form.preferentialTags}
              onChange={handleChange("preferentialTags")}
              placeholder="예: 청년, 여성기업"
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
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeading>신용 및 부채 정보</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="신용점수 최솟값" required error={errors.creditScoreMin}>
            <Input
              type="number"
              value={form.creditScoreMin}
              onChange={handleChange("creditScoreMin")}
              placeholder="예: 800"
            />
          </Field>
          <Field label="신용점수 최댓값" required error={errors.creditScoreMax}>
            <Input
              type="number"
              value={form.creditScoreMax}
              onChange={handleChange("creditScoreMax")}
              placeholder="예: 899"
            />
          </Field>
          <Field label="기존 부채 보유 여부">
            <Select value={form.hasDebt} onChange={handleChange("hasDebt")}>
              <option value="false">없음</option>
              <option value="true">있음</option>
            </Select>
          </Field>
          <Field
            label="기존 대출 금액"
            error={errors.existingLoanAmount}
            hint="원 단위"
          >
            <Input
              type="number"
              value={form.existingLoanAmount}
              onChange={handleChange("existingLoanAmount")}
              placeholder="예: 5000000"
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
          <Field label="필요 자금" required error={errors.neededAmount} hint="원 단위">
            <Input
              type="number"
              value={form.neededAmount}
              onChange={handleChange("neededAmount")}
              placeholder="예: 30000000"
            />
          </Field>
          <Field label="자기 자본" required error={errors.selfCapital} hint="원 단위">
            <Input
              type="number"
              value={form.selfCapital}
              onChange={handleChange("selfCapital")}
              placeholder="예: 10000000"
            />
          </Field>
          <Field
            label="월 상환 여력"
            required
            error={errors.monthlyRepaymentCapacity}
            hint="원 단위"
          >
            <Input
              type="number"
              value={form.monthlyRepaymentCapacity}
              onChange={handleChange("monthlyRepaymentCapacity")}
              placeholder="예: 500000"
            />
          </Field>
          <Field
            label="시장 분석 추정 창업 비용"
            error={errors.estimatedInitialCost}
            hint="원 단위, 시장 분석 기반 추정치"
          >
            <Input
              type="number"
              value={form.estimatedInitialCost}
              onChange={handleChange("estimatedInitialCost")}
              placeholder="예: 25000000"
            />
          </Field>
          <Field
            label="사용자 입력 필요 자금"
            required
            error={errors.userReportedAmount}
            hint="원 단위, 사용자가 직접 입력한 금액"
          >
            <Input
              type="number"
              value={form.userReportedAmount}
              onChange={handleChange("userReportedAmount")}
              placeholder="예: 30000000"
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
