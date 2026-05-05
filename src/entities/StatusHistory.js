import { EntitySchema } from "typeorm";

const StatusHistory = new EntitySchema({
  name: "StatusHistory",
  tableName: "status_history",
  columns: {
    id: { primary: true, type: "int", generated: true },
    status: { type: "varchar" },
    updated_at: { type: "timestamp", updateDate: true }
  },
  relations: {
    service_request: {
      type: "many-to-one",
      target: "ServiceRequest",
      joinColumn: { name: "service_request_id" },
      inverseSide: "status_history"
    },
    updated_by: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "updated_by_id" }
    }
  }
});

export default StatusHistory;