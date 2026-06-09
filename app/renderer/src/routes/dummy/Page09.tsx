import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage09() {
  return <DummyProductGrid title="Dummy Page 09" products={makeDummyProducts(9)} />;
}
