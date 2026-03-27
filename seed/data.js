const services = [
  {
    name: "Road Construction",
    description:
      "Full-cycle roadway execution from surveying and grading to asphalt finishing, signage, and handover.",
    icon: "route",
    highlights: ["Earthworks", "Sub-base preparation", "Asphalt paving"],
  },
  {
    name: "Structural Buildings",
    description:
      "Commercial, industrial, and public facility construction with strong delivery controls and quality assurance.",
    icon: "building-2",
    highlights: ["Concrete frames", "Steel structures", "Turnkey delivery"],
  },
  {
    name: "Drainage & Utilities",
    description:
      "Stormwater drainage, culverts, sewer lines, and underground utility coordination for resilient infrastructure.",
    icon: "waves",
    highlights: ["Pipe laying", "Channels", "Flood mitigation"],
  },
];

const projects = [
  {
    title: "Northern Ring Road Upgrade",
    slug: "northern-ring-road-upgrade",
    description:
      "A multi-kilometer road rehabilitation project including lane expansion, drainage upgrades, and smart signage.",
    location: "Cairo, Egypt",
    category: "Transportation",
    status: "ongoing",
    featured: true,
    images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"],
  },
  {
    title: "Al Noor Administrative Complex",
    slug: "al-noor-administrative-complex",
    description:
      "Construction of an energy-efficient office campus with reinforced concrete structures and modern facade systems.",
    location: "Giza, Egypt",
    category: "Buildings",
    status: "completed",
    featured: true,
    completionDate: "2025-11-10",
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"],
  },
  {
    title: "West Delta Drainage Network",
    slug: "west-delta-drainage-network",
    description:
      "A regional drainage improvement package designed to reduce flood risk and improve roadway durability.",
    location: "Alexandria, Egypt",
    category: "Utilities",
    status: "planned",
    featured: false,
    images: ["https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80"],
  },
];

module.exports = {
  services,
  projects,
};
