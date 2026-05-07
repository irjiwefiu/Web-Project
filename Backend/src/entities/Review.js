import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Review",
  tableName: "reviews",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    rating: {
      type: "int",
      nullable: false,
      // You can add logic in your controller to ensure 1-5
    },
    comment: {
      type: "text",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    request: {
      target: "ServiceRequest",
      type: "one-to-one", // One review per service request
      joinColumn: { name: "request_id" },
      onDelete: "CASCADE",
    },
    reviewer: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "reviewer_id" },
      onDelete: "CASCADE",
    },
    technician: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "technician_id" },
      onDelete: "CASCADE",
    },
  },
});