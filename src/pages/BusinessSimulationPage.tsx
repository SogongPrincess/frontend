import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";

export default function BusinessSimulationPage() {
  return (
    <Card variant="white">
      <PageTitle
        title="사업성 시뮬 화면입니다."
        description="매출, 비용, 수익성 시뮬레이션 결과를 보여줄 화면입니다."
      />
    </Card>
  );
}
