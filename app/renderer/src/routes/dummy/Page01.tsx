import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage01() {
  return <DummyProductGrid title="Dummy Page 01" products={makeDummyProducts(1)} />;
}
