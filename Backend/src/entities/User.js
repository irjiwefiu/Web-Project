import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar", nullable: true },
    username: { type: "varchar", nullable: true },
    email: { type: "varchar", unique: true },
    password: { type: "varchar" }
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