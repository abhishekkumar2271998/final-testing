import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage10() {
  return <DummyProductGrid title="Dummy Page 10" products={makeDummyProducts(10)} />;
}
