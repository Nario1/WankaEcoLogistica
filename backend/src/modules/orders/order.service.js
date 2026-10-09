import { conflict, notFound } from "../../shared/errors.js";
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

  async get(id) {
    requireUuid(id);
    const order = await this.orderRepository.findById(id);
    if (!order) throw notFound("Pedido");
    return order;
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

  async remove(id, actorId) {
    const current = await this.get(id);
    if (current.status !== "PENDING") {
      throw conflict("Solo se pueden cancelar pedidos pendientes");
    }
    const order = await this.orderRepository.remove(id);
    await this.auditRepository.record({
      userId: actorId,
      action: "ORDER_CANCELLED",
      entity: "orders",
      entityId: id,
    });
    return order;
  }
}
