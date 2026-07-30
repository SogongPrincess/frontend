import { RecommendationRequestForm } from "@/components/finance/RecommendationRequestForm";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";

export default function FinancePage() {
  return (
    <Card variant="white">
      <PageTitle
        title="금융상품 추천"
        description="아래 정보를 입력하고 추천받기를 누르면 나에게 맞는 금융상품과 지원사업을 확인할 수 있어요."
      />
      <div className="mt-8">
        <RecommendationRequestForm />
      </div>
    </Card>
  );
}
