import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { AssistantArea } from "@/components/assistant/AssistantArea";
import type { AssistantMessage } from "@/components/assistant/AssistantArea";

interface TodoItem {
  id: number;
  text: string;
  checked: boolean;
}

interface AnalysisSummary {
  id: number;
  title: string;
  badge: string;
  description: string;
  stats: string;
}

export default function HomePage() {
  const todos: TodoItem[] = [
    { id: 1, text: "최근 주요 통상 구조 살펴보기", checked: true },
    { id: 2, text: "새로운주간상점분석시스템 살펴보기", checked: true },
    { id: 3, text: "소상공인법제정투자 이해하기 - 2-3", checked: false },
    { id: 4, text: "입지선정자료 보는 법 배우기", checked: false },
    { id: 5, text: "오늘 CRM 당일활동", checked: false },
  ];

  const analysisSummaries: AnalysisSummary[] = [
    {
      id: 1,
      title: "종로차숨 82정점",
      badge: "상권분석",
      description: "매출구조 기본 요인",
      stats: "2024-02-24 • 분석됨",
    },
    {
      id: 2,
      title: "최대 5,000만원",
      badge: "정부지원금",
      description: "정부정상 정부정성",
      stats: "2024-2-3",
    },
  ];

  const assistantMessages: AssistantMessage[] = [
    {
      text: "청년창업 대출 신청까지 마감 2일 남았어요!",
      tone: "positive",
    },
    {
      text: "이번달 매출 리포트가 나왔어요. 잘 작인해놓겠어요?",
      tone: "negative",
    },
    {
      text: "사장님 조건에 맞는 지원사업 3개를 찾았어요!",
      tone: "negative",
    },
  ];

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,_rgba(255,168,0,0.08),_transparent_30%),linear-gradient(135deg,_var(--color-kb-background-soft)_0%,_var(--color-kb-background)_100%)]">
      {/* 캐릭터 섹션 */}
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <AssistantArea messages={assistantMessages} />
      </div>

      {/* 오늘의 할일 & 최근 분석 섹션 */}
      <div className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <PageTitle
          title="국민카페 이사장님"
          description="오늘도 화이팅이에요, 사장님"
          className="mb-8"
        />
        <div className="flex flex-col gap-6 md:flex-row">
          {/* 오늘의 할일 */}
          <div className="flex-1">
            <Card>
              <h2 className="text-xl font-semibold text-kb-gray">
                오늘의 할일 (2/5 완료)
              </h2>
              <div className="mt-6 space-y-3">
                {todos.map((todo) => (
                  <label
                    key={todo.id}
                    className="flex items-center gap-3 rounded-lg p-3 hover:bg-kb-background">
                    <input
                      type="checkbox"
                      checked={todo.checked}
                      readOnly
                      className="h-5 w-5 rounded border-kb-border-strong text-kb-yellow-positive"
                    />
                    <span
                      className={`text-sm ${
                        todo.checked
                          ? "line-through text-kb-light-tone"
                          : "text-kb-gray"
                      }`}>
                      {todo.text}
                    </span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          {/* 최근 분석&추천 요약 */}
          <div className="flex-1">
            <Card variant="white">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-kb-gray">
                  최근 분석 & 추천 요약
                </h2>
                <Button variant="outline" size="sm">
                  전체 보기
                </Button>
              </div>
              <div className="space-y-4">
                {analysisSummaries.map((summary) => (
                  <div
                    key={summary.id}
                    className="rounded-xl border border-kb-surface-secondary bg-kb-background p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="font-medium text-kb-gray">
                        {summary.title}
                      </h3>
                      <span className="rounded-full bg-kb-yellow-positive px-2 py-1 text-xs font-medium text-white">
                        {summary.badge}
                      </span>
                    </div>
                    <p className="mb-3 text-sm text-kb-mid-tone">
                      {summary.description}
                    </p>
                    <p className="text-xs text-kb-light-tone-2">
                      {summary.stats}
                    </p>
                    <button className="mt-4 rounded-lg bg-kb-surface-secondary px-3 py-1.5 text-xs font-medium text-kb-gray hover:bg-kb-border-strong">
                      보기 이동
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
