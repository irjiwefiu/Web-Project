import { EntitySchema } from "typeorm";

const Role = new EntitySchema({
  name: "Role",
  tableName: "roles",
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar", unique: true }
  },
  relations: {
    users: {
      type: "one-to-many",
      target: "User",
      inverseSide: "role"
    }
  }
});

export default Role;