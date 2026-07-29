import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";

export default function SettingsPage() {
  return (
    <Card variant="white">
      <PageTitle title="Settings" description="기본 설정 화면입니다." />
      <div className="mt-6 flex gap-3">
        <Button>저장하기</Button>
        <Button variant="outline">취소</Button>
      </div>
    </Card>
  );
}
