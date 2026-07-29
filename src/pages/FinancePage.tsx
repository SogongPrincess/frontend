import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";

export default function FinancePage() {
  return (
    <Card variant="white">
      <PageTitle
        title="금융 페이지입니다."
        description="대출, 지원금, 자금 계획 정보를 보여줄 화면입니다."
      />
    </Card>
  );
}
