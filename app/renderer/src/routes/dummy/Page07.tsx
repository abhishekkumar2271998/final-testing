import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage07() {
  return <DummyProductGrid title="Dummy Page 07" products={makeDummyProducts(7)} />;
}
