import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage06() {
  return <DummyProductGrid title="Dummy Page 06" products={makeDummyProducts(6)} />;
}
