import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage02() {
  return <DummyProductGrid title="Dummy Page 02" products={makeDummyProducts(2)} />;
}
