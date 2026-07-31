import { LocationRecommendationRequestForm } from "@/components/location/LocationRecommendationRequestForm";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";

export default function StartupLocationRecommendationPage() {
  return (
    <Card variant="white">
      <PageTitle
        title="창업 입지추천"
        description="아래 정보를 입력하고 추천받기를 누르면 조건에 맞는 창업 입지를 확인할 수 있어요."
      />
      <div className="mt-8">
        <LocationRecommendationRequestForm />
      </div>
    </Card>
  );
}
