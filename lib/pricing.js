export const plans = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    features: [
      "Browse public services",
      "Basic search",
      "Create bookings",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 19,
    features: [
      "Access to premium services",
      "Priority support",
      "Higher booking limits",
    ],
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 99,
    features: [
      "All Pro features",
      "SLA & dedicated support",
      "Custom integrations",
    ],
  },
];

export function getPlanById(id) {
  return plans.find((p) => p.id === id) || null;
}

