import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage03() {
  return <DummyProductGrid title="Dummy Page 03" products={makeDummyProducts(3)} />;
}
