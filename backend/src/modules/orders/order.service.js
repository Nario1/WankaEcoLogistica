import { notFound } from "../../shared/errors.js";
import { requireUuid } from "../../shared/validation.js";
import { validateOrder, validateOrderUpdate } from "./order.validation.js";

export class OrderService {
  constructor({ orderRepository, auditRepository }) {
    this.orderRepository = orderRepository;
    this.auditRepository = auditRepository;
  }

  list() {
    return this.orderRepository.list();
  }

  async create(input, actorId) {
    const order = await this.orderRepository.create(validateOrder(input));
    await this.auditRepository.record({
      userId: actorId,
      action: "ORDER_CREATED",
      entity: "orders",
      entityId: order.id,
    });
    return order;
  }

  async update(id, input, actorId) {
    requireUuid(id);
    validateOrderUpdate(input);
    const current = await this.orderRepository.findById(id);
    if (!current) throw notFound("Pedido");
    const merged = validateOrder({ ...current, ...input });
    const order = await this.orderRepository.update(id, merged);
    await this.auditRepository.record({
      userId: actorId,
      action: "ORDER_UPDATED",
      entity: "orders",
      entityId: id,
    });
    return order;
  }
}
