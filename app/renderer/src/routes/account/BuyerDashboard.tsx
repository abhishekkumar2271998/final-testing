import { BuyerDashboardPanel } from '@/components/account/BuyerDashboardPanel';
import { DashboardShell } from '@/components/account/DashboardShell';

export function BuyerDashboard() {
  return (
    <DashboardShell active="/buyer">
      <BuyerDashboardPanel />
    </DashboardShell>
  );
}
