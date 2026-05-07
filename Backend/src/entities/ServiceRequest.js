import { EntitySchema } from "typeorm";

const ServiceRequest = new EntitySchema({
  name: "ServiceRequest",
  tableName: "service_requests",
  columns: {
    id: { primary: true, type: "int", generated: true },
    title: { type: "varchar" },
    description: { type: "text" }
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