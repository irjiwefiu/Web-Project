import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Assignment",
  tableName: "assignments",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    status: {
      type: "varchar",
      default: "applied",
    },
    assigned_at: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    request: {
      target: "ServiceRequest",
      type: "many-to-one",
      joinColumn: { name: "request_id" },
      onDelete: "CASCADE",
    },
    technician: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "technician_id" },
      onDelete: "CASCADE",
    },
    assigned_by: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "assigned_by_id" },
      onDelete: "SET NULL",
    },
  },
});