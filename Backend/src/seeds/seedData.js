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
    price: 185.00,
    location: "123 Maple Street, Apt 4B, Downtown",
    urgency: "high",
    preferred_time: "2026-05-10T09:00:00Z",
  },
  {
    title: "Air conditioner maintenance",
    description: "AC unit needs a routine check and filter replacement before summer.",
    categoryName: "HVAC",
    customerEmail: "alice@example.com",
    price: 150.00,
    location: "123 Maple Street, Apt 4B, Downtown",
    urgency: "medium",
    preferred_time: "2026-05-08T14:00:00Z",
  },
  {
    title: "Bedroom painting",
    description: "Need to repaint two bedrooms with new colors. Walls are scuffed and old paint is peeling.",
    categoryName: "Painting",
    customerEmail: "alice@example.com",
    price: 450.00,
    location: "123 Maple Street, Apt 4B, Downtown",
    urgency: "low",
    preferred_time: "2026-05-20T10:00:00Z",
  },

  // Bob's requests
  {
    title: "Living room lights flickering",
    description: "Several lights in the living room flicker when switched on. Possibly a wiring issue.",
    categoryName: "Electrical",
    customerEmail: "bob@example.com",
    price: 220.00,
    location: "456 Oak Avenue, House, Westside",
    urgency: "high",
    preferred_time: "2026-05-11T08:00:00Z",
  },
  {
    title: "Deck repair needed",
    description: "Several deck boards are rotted and need replacing. About 20 sq ft of damage.",
    categoryName: "Carpentry",
    customerEmail: "bob@example.com",
    price: 380.00,
    location: "456 Oak Avenue, House, Westside",
    urgency: "medium",
    preferred_time: "2026-05-13T11:00:00Z",
  },

  // Carol's requests
  {
    title: "Roof leak repair",
    description: "There is a leak in the roof near the chimney area causing water damage on ceiling.",
    categoryName: "Roofing",
    customerEmail: "carol@example.com",
    price: 520.00,
    location: "789 Pine Road, Townhouse 12, East End",
    urgency: "high",
    preferred_time: "2026-05-12T07:00:00Z",
  },
  {
    title: "Bathroom faucet replacement",
    description: "The master bathroom faucet is dripping constantly. Need it replaced with new fixture.",
    categoryName: "Plumbing",
    customerEmail: "carol@example.com",
    price: 140.00,
    location: "789 Pine Road, Townhouse 12, East End",
    urgency: "medium",
    preferred_time: "2026-05-18T13:00:00Z",
  },

  // Daniel's requests
  {
    title: "Electrical panel upgrade",
    description: "Current panel is old 100A, need upgrade to 200A to support new appliances.",
    categoryName: "Electrical",
    customerEmail: "daniel@example.com",
    price: 1200.00,
    location: "321 Elm Street, House, Northside",
    urgency: "high",
    preferred_time: "2026-05-14T09:00:00Z",
  },
  {
    title: "Pest control treatment",
    description: "Noticed cockroaches in kitchen and bathrooms. Need full house treatment.",
    categoryName: "Pest Control",
    customerEmail: "daniel@example.com",
    price: 175.00,
    location: "321 Elm Street, House, Northside",
    urgency: "high",
    preferred_time: "2026-05-16T10:00:00Z",
  },

  // Eva's requests
  {
    title: "Washing machine repair",
    description: "Washing machine making loud grinding noise during spin cycle. Leaking from bottom.",
    categoryName: "Appliance Repair",
    customerEmail: "eva@example.com",
    price: 210.00,
    location: "654 Birch Lane, Condo 7G, Midtown",
    urgency: "high",
    preferred_time: "2026-05-09T15:00:00Z",
  },
  {
    title: "Garden landscaping",
    description: "Need front yard landscaping - lawn mowing, shrub trimming, and flower bed planting.",
    categoryName: "Landscaping",
    customerEmail: "eva@example.com",
    price: 300.00,
    location: "654 Birch Lane, Condo 7G, Midtown",
    urgency: "low",
    preferred_time: "2026-05-22T08:00:00Z",
  },

  // Frank's requests
  {
    title: "Deep house cleaning",
    description: "Moving in to new house, need full deep cleaning of all rooms including kitchen and bathrooms.",
    categoryName: "Cleaning",
    customerEmail: "frank@example.com",
    price: 250.00,
    location: "987 Cedar Court, House, Southside",
    urgency: "medium",
    preferred_time: "2026-05-17T09:00:00Z",
  },
  {
    title: "HVAC system servicing",
    description: "Annual HVAC service - filter change, coil cleaning, and performance check.",
    categoryName: "HVAC",
    customerEmail: "frank@example.com",
    price: 180.00,
    location: "987 Cedar Court, House, Southside",
    urgency: "medium",
    preferred_time: "2026-05-07T11:00:00Z",
  },

  // Grace's requests
  {
    title: "Cabinet installation",
    description: "Need to install new kitchen cabinets - 10 units total. All materials already purchased.",
    categoryName: "Carpentry",
    customerEmail: "grace@example.com",
    price: 650.00,
    location: "147 Walnut Drive, Apartment 3C, Uptown",
    urgency: "medium",
    preferred_time: "2026-05-13T08:00:00Z",
  },
  {
    title: "Water heater replacement",
    description: "Water heater is 12 years old and no longer heating efficiently. Needs full replacement.",
    categoryName: "Plumbing",
    customerEmail: "grace@example.com",
    price: 850.00,
    location: "147 Walnut Drive, Apartment 3C, Uptown",
    urgency: "high",
    preferred_time: "2026-05-19T07:00:00Z",
  },

  // Henry's requests
  {
    title: "Exterior house painting",
    description: "Full exterior repaint needed. 2-story house, approximately 2400 sq ft.",
    categoryName: "Painting",
    customerEmail: "henry@example.com",
    price: 2800.00,
    location: "258 Spruce Street, House, Lakeside",
    urgency: "low",
    preferred_time: "2026-05-15T08:00:00Z",
  },
  {
    title: "Outlet not working",
    description: "Several outlets in the garage stopped working after power outage. Breaker is fine.",
    categoryName: "Electrical",
    customerEmail: "henry@example.com",
    price: 160.00,
    location: "258 Spruce Street, House, Lakeside",
    urgency: "medium",
    preferred_time: "2026-05-21T14:00:00Z",
  },

  // Irene's requests
  {
    title: "Gutter cleaning and repair",
    description: "Gutters are clogged with leaves and one section has come loose from the fascia.",
    categoryName: "Roofing",
    customerEmail: "irene@example.com",
    price: 195.00,
    location: "369 Ash Boulevard, Townhouse 5, Riverside",
    urgency: "medium",
    preferred_time: "2026-05-18T10:00:00Z",
  },

  // James's requests
  {
    title: "Refrigerator not cooling",
    description: "Refrigerator stopped cooling. Freezer still works but main compartment is warm.",
    categoryName: "Appliance Repair",
    customerEmail: "james@example.com",
    price: 240.00,
    location: "741 Cherry Lane, House, Hilltop",
    urgency: "high",
    preferred_time: "2026-05-16T08:00:00Z",
  },
  {
    title: "Lawn mowing and edging",
    description: "Weekly lawn maintenance needed - mowing, edging, and blowing.",
    categoryName: "Landscaping",
    customerEmail: "james@example.com",
    price: 60.00,
    location: "741 Cherry Lane, House, Hilltop",
    urgency: "low",
    preferred_time: "2026-05-23T07:00:00Z",
  },
];

export const assignments = [
  // --- Customer-accepted applications (assignedByEmail = customer) ---
  // Alice accepted Emily's application for kitchen sink
  {
    requestTitle: "Kitchen sink leaking",
    technicianEmail: "tech.emily@example.com",
    assignedByEmail: "alice@example.com",
  },
  // Alice accepted Carlos's application for AC maintenance
  {
    requestTitle: "Air conditioner maintenance",
    technicianEmail: "tech.carlos@example.com",
    assignedByEmail: "alice@example.com",
  },
  // Bob accepted John's application for flickering lights
  {
    requestTitle: "Living room lights flickering",
    technicianEmail: "tech.john@example.com",
    assignedByEmail: "bob@example.com",
  },
  // Eva accepted Marcus's application for washing machine
  {
    requestTitle: "Washing machine repair",
    technicianEmail: "tech.marcus@example.com",
    assignedByEmail: "eva@example.com",
  },
  // Frank accepted Carlos's application for HVAC servicing
  {
    requestTitle: "HVAC system servicing",
    technicianEmail: "tech.carlos@example.com",
    assignedByEmail: "frank@example.com",
  },

  // --- Admin direct assignments ---
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
    requestTitle: "Cabinet installation",
    technicianEmail: "tech.priya@example.com",
    assignedByEmail: "admin@example.com",
  },
  {
    requestTitle: "Exterior house painting",
    technicianEmail: "tech.david@example.com",
    assignedByEmail: "admin@example.com",
  },
];

export const statusHistory = [
  // Kitchen sink leaking - completed flow (customer accepted application)
  { requestTitle: "Kitchen sink leaking", status: "requested", updatedByEmail: "alice@example.com" },
  { requestTitle: "Kitchen sink leaking", status: "assigned", updatedByEmail: "alice@example.com" },
  { requestTitle: "Kitchen sink leaking", status: "on_the_way", updatedByEmail: "tech.emily@example.com" },
  { requestTitle: "Kitchen sink leaking", status: "in_progress", updatedByEmail: "tech.emily@example.com" },
  { requestTitle: "Kitchen sink leaking", status: "completed", updatedByEmail: "tech.emily@example.com" },

  // Living room lights - in progress (customer accepted application)
  { requestTitle: "Living room lights flickering", status: "requested", updatedByEmail: "bob@example.com" },
  { requestTitle: "Living room lights flickering", status: "assigned", updatedByEmail: "bob@example.com" },
  { requestTitle: "Living room lights flickering", status: "on_the_way", updatedByEmail: "tech.john@example.com" },
  { requestTitle: "Living room lights flickering", status: "in_progress", updatedByEmail: "tech.john@example.com" },

  // AC maintenance - completed (customer accepted application)
  { requestTitle: "Air conditioner maintenance", status: "requested", updatedByEmail: "alice@example.com" },
  { requestTitle: "Air conditioner maintenance", status: "assigned", updatedByEmail: "alice@example.com" },
  { requestTitle: "Air conditioner maintenance", status: "on_the_way", updatedByEmail: "tech.carlos@example.com" },
  { requestTitle: "Air conditioner maintenance", status: "in_progress", updatedByEmail: "tech.carlos@example.com" },
  { requestTitle: "Air conditioner maintenance", status: "completed", updatedByEmail: "tech.carlos@example.com" },

  // Deck repair - assigned but not started (admin assigned)
  { requestTitle: "Deck repair needed", status: "requested", updatedByEmail: "bob@example.com" },
  { requestTitle: "Deck repair needed", status: "assigned", updatedByEmail: "admin@example.com" },

  // Roof leak - in progress (admin assigned)
  { requestTitle: "Roof leak repair", status: "requested", updatedByEmail: "carol@example.com" },
  { requestTitle: "Roof leak repair", status: "assigned", updatedByEmail: "admin@example.com" },
  { requestTitle: "Roof leak repair", status: "on_the_way", updatedByEmail: "tech.sarah@example.com" },
  { requestTitle: "Roof leak repair", status: "in_progress", updatedByEmail: "tech.sarah@example.com" },

  // Electrical panel - assigned but not started (admin assigned)
  { requestTitle: "Electrical panel upgrade", status: "requested", updatedByEmail: "daniel@example.com" },
  { requestTitle: "Electrical panel upgrade", status: "assigned", updatedByEmail: "admin@example.com" },

  // Washing machine - completed (customer accepted application)
  { requestTitle: "Washing machine repair", status: "requested", updatedByEmail: "eva@example.com" },
  { requestTitle: "Washing machine repair", status: "assigned", updatedByEmail: "eva@example.com" },
  { requestTitle: "Washing machine repair", status: "on_the_way", updatedByEmail: "tech.marcus@example.com" },
  { requestTitle: "Washing machine repair", status: "in_progress", updatedByEmail: "tech.marcus@example.com" },
  { requestTitle: "Washing machine repair", status: "completed", updatedByEmail: "tech.marcus@example.com" },

  // Cabinet installation - in progress (admin assigned)
  { requestTitle: "Cabinet installation", status: "requested", updatedByEmail: "grace@example.com" },
  { requestTitle: "Cabinet installation", status: "assigned", updatedByEmail: "admin@example.com" },
  { requestTitle: "Cabinet installation", status: "on_the_way", updatedByEmail: "tech.priya@example.com" },
  { requestTitle: "Cabinet installation", status: "in_progress", updatedByEmail: "tech.priya@example.com" },

  // Exterior painting - assigned but not started (admin assigned)
  { requestTitle: "Exterior house painting", status: "requested", updatedByEmail: "henry@example.com" },
  { requestTitle: "Exterior house painting", status: "assigned", updatedByEmail: "admin@example.com" },

  // HVAC servicing - completed (customer accepted application)
  { requestTitle: "HVAC system servicing", status: "requested", updatedByEmail: "frank@example.com" },
  { requestTitle: "HVAC system servicing", status: "assigned", updatedByEmail: "frank@example.com" },
  { requestTitle: "HVAC system servicing", status: "on_the_way", updatedByEmail: "tech.carlos@example.com" },
  { requestTitle: "HVAC system servicing", status: "in_progress", updatedByEmail: "tech.carlos@example.com" },
  { requestTitle: "HVAC system servicing", status: "completed", updatedByEmail: "tech.carlos@example.com" },

  // Unassigned requests - just requested (open for applications)
  { requestTitle: "Bedroom painting", status: "requested", updatedByEmail: "alice@example.com" },
  { requestTitle: "Bathroom faucet replacement", status: "requested", updatedByEmail: "carol@example.com" },
  { requestTitle: "Pest control treatment", status: "requested", updatedByEmail: "daniel@example.com" },
  { requestTitle: "Garden landscaping", status: "requested", updatedByEmail: "eva@example.com" },
  { requestTitle: "Deep house cleaning", status: "requested", updatedByEmail: "frank@example.com" },
  { requestTitle: "Water heater replacement", status: "requested", updatedByEmail: "grace@example.com" },
  { requestTitle: "Outlet not working", status: "requested", updatedByEmail: "henry@example.com" },
  { requestTitle: "Gutter cleaning and repair", status: "requested", updatedByEmail: "irene@example.com" },
  { requestTitle: "Refrigerator not cooling", status: "requested", updatedByEmail: "james@example.com" },
  { requestTitle: "Lawn mowing and edging", status: "requested", updatedByEmail: "james@example.com" },
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
