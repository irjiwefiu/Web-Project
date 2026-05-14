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
  { name: "Painting" },
  { name: "Roofing" },
  { name: "Landscaping" },
  { name: "Appliance Repair" },
  { name: "Pest Control" },
  { name: "Cleaning" },
];

export const users = [
  // Admin
  { name: "Admin User", username: "admin", email: "admin@example.com", password: "admin123", roleName: "admin" },

  // Technicians
  { name: "John Smith", username: "tech_john", email: "tech.john@example.com", password: "tech123", roleName: "technician" },
  { name: "Emily Davis", username: "tech_emily", email: "tech.emily@example.com", password: "tech123", roleName: "technician" },
  { name: "Carlos Rivera", username: "tech_carlos", email: "tech.carlos@example.com", password: "tech123", roleName: "technician" },
  { name: "Priya Patel", username: "tech_priya", email: "tech.priya@example.com", password: "tech123", roleName: "technician" },
  { name: "David Kim", username: "tech_david", email: "tech.david@example.com", password: "tech123", roleName: "technician" },
  { name: "Sarah Thompson", username: "tech_sarah", email: "tech.sarah@example.com", password: "tech123", roleName: "technician" },
  { name: "Marcus Johnson", username: "tech_marcus", email: "tech.marcus@example.com", password: "tech123", roleName: "technician" },

  // Customers
  { name: "Alice Johnson", username: "alice", email: "alice@example.com", password: "customer123", roleName: "customer" },
  { name: "Bob Williams", username: "bob", email: "bob@example.com", password: "customer123", roleName: "customer" },
  { name: "Carol Martinez", username: "carol", email: "carol@example.com", password: "customer123", roleName: "customer" },
  { name: "Daniel Brown", username: "daniel", email: "daniel@example.com", password: "customer123", roleName: "customer" },
  { name: "Eva Green", username: "eva", email: "eva@example.com", password: "customer123", roleName: "customer" },
  { name: "Frank Lee", username: "frank", email: "frank@example.com", password: "customer123", roleName: "customer" },
  { name: "Grace Wilson", username: "grace", email: "grace@example.com", password: "customer123", roleName: "customer" },
  { name: "Henry Taylor", username: "henry", email: "henry@example.com", password: "customer123", roleName: "customer" },
  { name: "Irene Clark", username: "irene", email: "irene@example.com", password: "customer123", roleName: "customer" },
  { name: "James White", username: "james", email: "james@example.com", password: "customer123", roleName: "customer" },
];

export const technicianProfiles = [
  {
    userEmail: "tech.john@example.com",
    bio: "Certified electrician with 6 years of experience. Specializes in residential wiring and panel upgrades.",
    skills: ["Electrical", "Lighting", "Wiring", "Panel Upgrades"],
    availability_status: "available",
    rating: 4.7,
    total_jobs: 34,
  },
  {
    userEmail: "tech.emily@example.com",
    bio: "Plumbing specialist focusing on fast, reliable repairs. Licensed master plumber with 8 years experience.",
    skills: ["Plumbing", "Drain Repair", "Fixture Installation", "Water Heaters"],
    availability_status: "busy",
    rating: 4.9,
    total_jobs: 52,
  },
  {
    userEmail: "tech.carlos@example.com",
    bio: "HVAC certified technician with expertise in central air and heating systems. 5 years experience.",
    skills: ["HVAC", "Air Conditioning", "Heating Systems", "Ventilation"],
    availability_status: "available",
    rating: 4.5,
    total_jobs: 28,
  },
  {
    userEmail: "tech.priya@example.com",
    bio: "Skilled carpenter and woodworker with 10 years of residential and commercial experience.",
    skills: ["Carpentry", "Furniture Assembly", "Flooring", "Cabinets"],
    availability_status: "available",
    rating: 4.8,
    total_jobs: 61,
  },
  {
    userEmail: "tech.david@example.com",
    bio: "Professional painter with expertise in interior and exterior painting. 7 years experience.",
    skills: ["Painting", "Wallpaper", "Drywall", "Finishing"],
    availability_status: "offline",
    rating: 4.2,
    total_jobs: 19,
  },
  {
    userEmail: "tech.sarah@example.com",
    bio: "Roofing expert specializing in repairs, inspections, and full replacements. Licensed and insured.",
    skills: ["Roofing", "Gutter Installation", "Leak Repair", "Inspections"],
    availability_status: "available",
    rating: 4.6,
    total_jobs: 23,
  },
  {
    userEmail: "tech.marcus@example.com",
    bio: "Multi-skilled handyman proficient in appliance repair, plumbing, and general maintenance.",
    skills: ["Appliance Repair", "General Maintenance", "Pest Control", "Cleaning"],
    availability_status: "busy",
    rating: 4.3,
    total_jobs: 41,
  },
];

export const serviceRequests = [
  // Alice's requests
  {
    title: "Kitchen sink leaking",
    description: "Water is leaking from the kitchen sink pipe and dripping constantly onto the cabinet floor.",
    categoryName: "Plumbing",
    customerEmail: "alice@example.com",
  },
  {
    title: "Air conditioner maintenance",
    description: "AC unit needs a routine check and filter replacement before summer.",
    categoryName: "HVAC",
    customerEmail: "alice@example.com",
  },
  {
    title: "Bedroom painting",
    description: "Need to repaint two bedrooms with new colors. Walls are scuffed and old paint is peeling.",
    categoryName: "Painting",
    customerEmail: "alice@example.com",
  },

  // Bob's requests
  {
    title: "Living room lights flickering",
    description: "Several lights in the living room flicker when switched on. Possibly a wiring issue.",
    categoryName: "Electrical",
    customerEmail: "bob@example.com",
  },
  {
    title: "Deck repair needed",
    description: "Several deck boards are rotted and need replacing. About 20 sq ft of damage.",
    categoryName: "Carpentry",
    customerEmail: "bob@example.com",
  },

  // Carol's requests
  {
    title: "Roof leak repair",
    description: "There is a leak in the roof near the chimney area causing water damage on ceiling.",
    categoryName: "Roofing",
    customerEmail: "carol@example.com",
    price: 350.00,
    payment_status: "unpaid"
  },
  {
    title: "Bathroom faucet replacement",
    description: "The master bathroom faucet is dripping constantly. Need it replaced with new fixture.",
    categoryName: "Plumbing",
    customerEmail: "carol@example.com",
  },

  // Daniel's requests
  {
    title: "Electrical panel upgrade",
    description: "Current panel is old 100A, need upgrade to 200A to support new appliances.",
    categoryName: "Electrical",
    customerEmail: "daniel@example.com",
  },
  {
    title: "Pest control treatment",
    description: "Noticed cockroaches in kitchen and bathrooms. Need full house treatment.",
    categoryName: "Pest Control",
    customerEmail: "daniel@example.com",
    price: 120.00,
    payment_status: "paid"
  },

  // Eva's requests
  {
    title: "Washing machine repair",
    description: "Washing machine making loud grinding noise during spin cycle. Leaking from bottom.",
    categoryName: "Appliance Repair",
    customerEmail: "eva@example.com",
  },
  {
    title: "Garden landscaping",
    description: "Need front yard landscaping - lawn mowing, shrub trimming, and flower bed planting.",
    categoryName: "Landscaping",
    customerEmail: "eva@example.com",
  },

  // Frank's requests
  {
    title: "Deep house cleaning",
    description: "Moving in to new house, need full deep cleaning of all rooms including kitchen and bathrooms.",
    categoryName: "Cleaning",
    customerEmail: "frank@example.com",
  },
  {
    title: "HVAC system servicing",
    description: "Annual HVAC service - filter change, coil cleaning, and performance check.",
    categoryName: "HVAC",
    customerEmail: "frank@example.com",
  },

  // Grace's requests
  {
    title: "Cabinet installation",
    description: "Need to install new kitchen cabinets - 10 units total. All materials already purchased.",
    categoryName: "Carpentry",
    customerEmail: "grace@example.com",
  },
  {
    title: "Water heater replacement",
    description: "Water heater is 12 years old and no longer heating efficiently. Needs full replacement.",
    categoryName: "Plumbing",
    customerEmail: "grace@example.com",
  },

  // Henry's requests
  {
    title: "Exterior house painting",
    description: "Full exterior repaint needed. 2-story house, approximately 2400 sq ft.",
    categoryName: "Painting",
    customerEmail: "henry@example.com",
  },
  {
    title: "Outlet not working",
    description: "Several outlets in the garage stopped working after power outage. Breaker is fine.",
    categoryName: "Electrical",
    customerEmail: "henry@example.com",
  },

  // Irene's requests
  {
    title: "Gutter cleaning and repair",
    description: "Gutters are clogged with leaves and one section has come loose from the fascia.",
    categoryName: "Roofing",
    customerEmail: "irene@example.com",
  },

  // James's requests
  {
    title: "Refrigerator not cooling",
    description: "Refrigerator stopped cooling. Freezer still works but main compartment is warm.",
    categoryName: "Appliance Repair",
    customerEmail: "james@example.com",
  },
  {
    title: "Lawn mowing and edging",
    description: "Weekly lawn maintenance needed - mowing, edging, and blowing.",
    categoryName: "Landscaping",
    customerEmail: "james@example.com",
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
  {
    requestTitle: "Air conditioner maintenance",
    technicianEmail: "tech.carlos@example.com",
    assignedByEmail: "admin@example.com",
  },
  {
    requestTitle: "Deck repair needed",
    technicianEmail: "tech.priya@example.com",
    assignedByEmail: "admin@example.com",
  },
  {
    requestTitle: "Roof leak repair",
    technicianEmail: "tech.sarah@example.com",
    assignedByEmail: "admin@example.com",
  },
  {
    requestTitle: "Electrical panel upgrade",
    technicianEmail: "tech.john@example.com",
    assignedByEmail: "admin@example.com",
  },
  {
    requestTitle: "Washing machine repair",
    technicianEmail: "tech.marcus@example.com",
    assignedByEmail: "admin@example.com",
  },
  {
    requestTitle: "Cabinet installation",
    technicianEmail: "tech.priya@example.com",
    assignedByEmail: "admin@example.com",
  },
  {
    requestTitle: "Exterior house painting",
    technicianEmail: "tech.david@example.com",
    assignedByEmail: "admin@example.com",
  },
  {
    requestTitle: "HVAC system servicing",
    technicianEmail: "tech.carlos@example.com",
    assignedByEmail: "admin@example.com",
  },
];

export const statusHistory = [
  // Kitchen sink leaking - completed flow
  { requestTitle: "Kitchen sink leaking", status: "pending", updatedByEmail: "alice@example.com" },
  { requestTitle: "Kitchen sink leaking", status: "in_progress", updatedByEmail: "admin@example.com" },
  { requestTitle: "Kitchen sink leaking", status: "completed", updatedByEmail: "tech.emily@example.com" },

  // Living room lights - in progress
  { requestTitle: "Living room lights flickering", status: "pending", updatedByEmail: "bob@example.com" },
  { requestTitle: "Living room lights flickering", status: "in_progress", updatedByEmail: "admin@example.com" },

  // AC maintenance - completed
  { requestTitle: "Air conditioner maintenance", status: "pending", updatedByEmail: "alice@example.com" },
  { requestTitle: "Air conditioner maintenance", status: "in_progress", updatedByEmail: "admin@example.com" },
  { requestTitle: "Air conditioner maintenance", status: "completed", updatedByEmail: "tech.carlos@example.com" },

  // Deck repair - pending
  { requestTitle: "Deck repair needed", status: "pending", updatedByEmail: "bob@example.com" },

  // Roof leak - in progress
  { requestTitle: "Roof leak repair", status: "pending", updatedByEmail: "carol@example.com" },
  { requestTitle: "Roof leak repair", status: "in_progress", updatedByEmail: "admin@example.com" },

  // Electrical panel - pending
  { requestTitle: "Electrical panel upgrade", status: "pending", updatedByEmail: "daniel@example.com" },

  // Washing machine - completed
  { requestTitle: "Washing machine repair", status: "pending", updatedByEmail: "eva@example.com" },
  { requestTitle: "Washing machine repair", status: "in_progress", updatedByEmail: "admin@example.com" },
  { requestTitle: "Washing machine repair", status: "completed", updatedByEmail: "tech.marcus@example.com" },

  // Cabinet installation - in progress
  { requestTitle: "Cabinet installation", status: "pending", updatedByEmail: "grace@example.com" },
  { requestTitle: "Cabinet installation", status: "in_progress", updatedByEmail: "admin@example.com" },

  // Exterior painting - pending
  { requestTitle: "Exterior house painting", status: "pending", updatedByEmail: "henry@example.com" },

  // HVAC servicing - completed
  { requestTitle: "HVAC system servicing", status: "pending", updatedByEmail: "frank@example.com" },
  { requestTitle: "HVAC system servicing", status: "in_progress", updatedByEmail: "admin@example.com" },
  { requestTitle: "HVAC system servicing", status: "completed", updatedByEmail: "tech.carlos@example.com" },
];

export const reviews = [
  {
    requestTitle: "Kitchen sink leaking",
    rating: 5,
    comment: "Quick and professional repair. Emily fixed everything perfectly. Highly recommend!",
    reviewerEmail: "alice@example.com",
    technicianEmail: "tech.emily@example.com",
  },
  {
    requestTitle: "Air conditioner maintenance",
    rating: 4,
    comment: "Great service, arrived on time and did a thorough job. AC is running perfectly now.",
    reviewerEmail: "alice@example.com",
    technicianEmail: "tech.carlos@example.com",
  },
  {
    requestTitle: "Washing machine repair",
    rating: 5,
    comment: "Marcus was amazing! Fixed the issue quickly and explained what went wrong. Will definitely call again.",
    reviewerEmail: "eva@example.com",
    technicianEmail: "tech.marcus@example.com",
  },
  {
    requestTitle: "HVAC system servicing",
    rating: 4,
    comment: "Very professional and thorough. Explained everything clearly. System working great.",
    reviewerEmail: "frank@example.com",
    technicianEmail: "tech.carlos@example.com",
  },
];
