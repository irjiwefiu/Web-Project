import { EntitySchema } from "typeorm";

const ServiceCategory = new EntitySchema({
  name: "ServiceCategory",
  tableName: "service_categories",
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar" }
  },
  relations: {
    service_requests: {
      type: "one-to-many",
      target: "ServiceRequest",
      inverseSide: "category"
    }
  }
});

export default ServiceCategory;