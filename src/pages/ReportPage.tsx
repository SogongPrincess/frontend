import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";

export default function ReportPage() {
  return (
    <Card variant="white">
      <PageTitle
        title="리포트 페이지입니다."
        description="분석 리포트와 결과 요약을 보여줄 화면입니다."
      />
    </Card>
  );
}
