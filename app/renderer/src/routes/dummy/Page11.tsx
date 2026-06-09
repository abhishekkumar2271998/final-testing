import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage11() {
  return <DummyProductGrid title="Dummy Page 11" products={makeDummyProducts(11)} />;
}
