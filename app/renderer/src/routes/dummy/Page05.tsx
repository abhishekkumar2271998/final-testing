import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage05() {
  return <DummyProductGrid title="Dummy Page 05" products={makeDummyProducts(5)} />;
}
