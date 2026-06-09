import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage15() {
  return <DummyProductGrid title="Dummy Page 15" products={makeDummyProducts(15)} />;
}
