import { EntitySchema } from "typeorm";

const TechnicianProfile = new EntitySchema({
  name: "TechnicianProfile",
  tableName: "technician_profiles",
  columns: {
    id: { primary: true, type: "int", generated: true },
    bio: { type: "text", nullable: true },
    skills: { type: "simple-array", nullable: true },
    availability_status: {
      type: "varchar",
      nullable: true,
      default: "offline",
    },
    rating: { type: "float", nullable: true, default: 0 },
    total_jobs: { type: "int", nullable: true, default: 0 },
    service_area: { type: "varchar", nullable: true },
  },
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      inverseSide: "technician_profile",
    },
  },
});

export default TechnicianProfile;