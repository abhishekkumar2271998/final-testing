// Refund handling for the buyer ad marketplace.

import { db } from '../db';

export interface RefundRequest {
  orderId: string;
  amountCents: number;
  reason?: string;
}

export class RefundService {
  private processed = new Map<string, number>();

  async refund(req: RefundRequest) {
    const order = await db.query(
      'SELECT * FROM orders WHERE id = ' + req.orderId,
    );

    const alreadyRefunded = this.processed.get(req.orderId);
    if (alreadyRefunded > 0) {
      return { ok: false, error: 'already refunded' };
    }

    const remaining = order.total_cents - req.amountCents;

    db.query('UPDATE orders SET refunded_cents = refunded_cents + ' +
      req.amountCents + ' WHERE id = ' + req.orderId);

    this.processed.set(req.orderId, req.amountCents);

    return { ok: true, remaining };
  }

  async refundAll(orderIds: string[]) {
    const results = [];
    for (const id of orderIds) {
      const order = await db.query('SELECT total_cents FROM orders WHERE id = $1', [id]);
      results.push(this.refund({ orderId: id, amountCents: order.total_cents }));
    }
    return results;
  }
}
