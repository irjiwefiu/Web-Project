import { EntitySchema } from "typeorm";

const TechnicianProfile = new EntitySchema({
  name: "TechnicianProfile",
  tableName: "technician_profiles",
  columns: {
    id: { primary: true, type: "int", generated: true },
    bio: { type: "text", nullable: true },
    skills: { type: "simple-array", nullable: true }
  },
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      inverseSide: "technician_profile"
    }
  }
});

export default TechnicianProfile;