export const robotServices = [
  {
    id: "svc-1",
    title: "Warehouse Picking Assistant",
    company: "Maru Robotics",
    location: "Remote · Global",
    tags: ["logistics", "picking", "autonomy"],
    href: "https://example.com/services/warehouse-picking",
    summary: "Autonomous picking and sorting in warehouse environments.",
    premium: false,
  },
  {
    id: "svc-2",
    title: "Residential Delivery Bot Operator",
    company: "ParcelPilot",
    location: "Austin, TX",
    tags: ["delivery", "teleop", "last‑mile"],
    href: "https://example.com/services/delivery-operator",
    summary: "Teleoperate and supervise last‑mile delivery robots.",
    premium: true,
  },
  {
    id: "svc-3",
    title: "Hospital Courier Robot Fleet",
    company: "CarePath",
    location: "Boston, MA",
    tags: ["healthcare", "fleet", "mapping"],
    href: "https://example.com/services/hospital-courier",
    summary: "Automate specimen and supply transport across hospital wings.",
    premium: true,
  },
  {
    id: "svc-4",
    title: "Autonomous Lawn Care",
    company: "GreenByte",
    location: "Orlando, FL",
    tags: ["outdoor", "navigation", "maintenance"],
    href: "https://example.com/services/lawn-care",
    summary: "Precision mowing and edging with autonomous navigation.",
    premium: false,
  },
  {
    id: "svc-5",
    title: "Security Patrol Rover",
    company: "Aegis Robotics",
    location: "Remote · Night Shift",
    tags: ["security", "vision", "alerts"],
    href: "https://example.com/services/security-patrol",
    summary: "Perimeter patrol with AI‑driven anomaly detection.",
    premium: true,
  },
  {
    id: "svc-6",
    title: "Retail Shelf Scanning",
    company: "ShelfSense",
    location: "Chicago, IL",
    tags: ["retail", "inventory", "scanner"],
    href: "https://example.com/services/retail-scanner",
    summary: "Automate price/stock checks and planogram compliance.",
    premium: false,
  },
];

export function searchServices(query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return robotServices;
  return robotServices.filter((s) => {
    const haystack = [
      s.id,
      s.title,
      s.company,
      s.location,
      s.summary,
      ...(s.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getServiceById(id) {
  return robotServices.find((s) => s.id === id) || null;
}

