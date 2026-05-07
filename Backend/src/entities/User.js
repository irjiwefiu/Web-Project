import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { primary: true, type: "int", generated: true },
    username: { type: "varchar" },
    email: { type: "varchar", unique: true }
  },
  relations: {
    role: {
      type: "many-to-one",
      target: "Role",
      joinColumn: { name: "role_id" },
      inverseSide: "users"
    },
    technician_profile: {
      type: "one-to-one",
      target: "TechnicianProfile",
      inverseSide: "user"
    },
    service_requests: {
      type: "one-to-many",
      target: "ServiceRequest",
      inverseSide: "customer"
    }
  }
});

export default User;