import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";

export default function NotFoundPage() {
  return (
    <Card variant="white" className="text-center">
      <PageTitle
        title="404"
        description="The page you are looking for does not exist."
      />
    </Card>
  );
}
