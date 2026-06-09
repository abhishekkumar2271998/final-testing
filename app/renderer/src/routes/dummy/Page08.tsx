import { DummyProductGrid, makeDummyProducts } from '@/components/dummy/DummyProductGrid';

export function DummyPage08() {
  return <DummyProductGrid title="Dummy Page 08" products={makeDummyProducts(8)} />;
}
