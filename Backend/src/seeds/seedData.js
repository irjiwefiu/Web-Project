export const roles = [
  { name: "admin" },
  { name: "technician" },
  { name: "customer" },
];

export const categories = [
  { name: "Plumbing" },
  { name: "Electrical" },
  { name: "HVAC" },
  { name: "Carpentry" },
];

export const users = [
  { name: "Admin User", username: "admin", email: "admin@example.com", password: "admin123", roleName: "admin" },
  { name: "John Smith", username: "tech_john", email: "tech.john@example.com", password: "tech123", roleName: "technician" },
  { name: "Emily Davis", username: "tech_emily", email: "tech.emily@example.com", password: "tech123", roleName: "technician" },
  { name: "Alice Johnson", username: "alice", email: "alice@example.com", password: "customer123", roleName: "customer" },
  { name: "Bob Williams", username: "bob", email: "bob@example.com", password: "customer123", roleName: "customer" },
];

export const technicianProfiles = [
  {
    userEmail: "tech.john@example.com",
    bio: "Certified electrician with 6 years of experience.",
    skills: ["Electrical", "Lighting", "Wiring"],
  },
  {
    userEmail: "tech.emily@example.com",
    bio: "Plumbing specialist focusing on fast, reliable repairs.",
    skills: ["Plumbing", "Drain Repair", "Fixture Installation"],
  },
];

export const serviceRequests = [
  {
    title: "Kitchen sink leaking",
    description: "Water is leaking from the kitchen sink pipe and dripping constantly.",
    categoryName: "Plumbing",
    customerEmail: "alice@example.com",
  },
  {
    title: "Living room lights flickering",
    description: "Several lights in the living room flicker when switched on.",
    categoryName: "Electrical",
    customerEmail: "bob@example.com",
  },
  {
    title: "Air conditioner maintenance",
    description: "AC unit needs a routine check and filter replacement.",
    categoryName: "HVAC",
    customerEmail: "alice@example.com",
  },
];

export const assignments = [
  {
    requestTitle: "Kitchen sink leaking",
    technicianEmail: "tech.emily@example.com",
    assignedByEmail: "admin@example.com",
  },
  {
    requestTitle: "Living room lights flickering",
    technicianEmail: "tech.john@example.com",
    assignedByEmail: "admin@example.com",
  },
];

export const statusHistory = [
  {
    requestTitle: "Kitchen sink leaking",
    status: "Pending",
    updatedByEmail: "alice@example.com",
  },
  {
    requestTitle: "Kitchen sink leaking",
    status: "In Progress",
    updatedByEmail: "admin@example.com",
  },
  {
    requestTitle: "Living room lights flickering",
    status: "Assigned",
    updatedByEmail: "admin@example.com",
  },
];

export const reviews = [
  {
    requestTitle: "Kitchen sink leaking",
    rating: 5,
    comment: "Quick and professional repair. Highly recommend!",
    reviewerEmail: "alice@example.com",
    technicianEmail: "tech.emily@example.com",
  },
];
