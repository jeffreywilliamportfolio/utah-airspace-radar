import { AppShell } from "@/components/app-shell";
import { getDashboardData } from "@/lib/dashboard-service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getDashboardData();
  return <AppShell initialData={data} />;
}
