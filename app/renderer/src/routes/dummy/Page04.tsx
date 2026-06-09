import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage04() {
  return <DummyProductGrid title="Dummy Page 04" products={makeDummyProducts(4)} />;
}
