import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage12() {
  return <DummyProductGrid title="Dummy Page 12" products={makeDummyProducts(12)} />;
}
