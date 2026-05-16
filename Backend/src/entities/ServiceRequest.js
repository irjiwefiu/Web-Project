import { EntitySchema } from "typeorm";

const ServiceRequest = new EntitySchema({
  name: "ServiceRequest",
  tableName: "service_requests",
  columns: {
    id: { primary: true, type: "int", generated: true },
    title: { type: "varchar" },
    description: { type: "text" },
    price: { type: "decimal", precision: 10, scale: 2, nullable: true, default: 0.00 },
    location: { type: "varchar", nullable: true },
    urgency: { type: "varchar", nullable: true, default: "medium" },
    preferred_time: { type: "timestamp", nullable: true },
    is_paid: { type: "boolean", nullable: true, default: false },
    created_at: { type: "timestamp", createDate: true }
  },
  relations: {
    customer: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "customer_id" },
      inverseSide: "service_requests"
    },
    category: {
      type: "many-to-one",
      target: "ServiceCategory",
      joinColumn: { name: "category_id" },
      inverseSide: "service_requests"
    },
    assignments: {
      type: "one-to-many",
      target: "Assignment",
      inverseSide: "service_request"
    },
    status_history: {
      type: "one-to-many",
      target: "StatusHistory",
      inverseSide: "service_request"
    }
  }
});

export default ServiceRequest;