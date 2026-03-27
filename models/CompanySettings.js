const mongoose = require("mongoose");

const companySettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "Civil Works Co.",
      trim: true,
    },
    companyTagline: {
      type: String,
      default: "Building infrastructure with confidence",
      trim: true,
    },
    contactEmail: {
      type: String,
      default: "hello@civilworksco.com",
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      default: "+20 100 555 0099",
      trim: true,
    },
    addressLine1: {
      type: String,
      default: "Nasr City, Cairo",
      trim: true,
    },
    addressLine2: {
      type: String,
      default: "Egypt",
      trim: true,
    },
    officeHours: {
      type: String,
      default: "Sunday - Thursday, 8:00 AM - 5:00 PM",
      trim: true,
    },
    contactIntro: {
      type: String,
      default: "Tell us about your project scope, location, or tender requirements and our team will get back to you.",
      trim: true,
    },
    footerSummary: {
      type: String,
      default:
        "We deliver civil infrastructure, buildings, and utility projects with disciplined execution, dependable quality, and long-term value.",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CompanySettings", companySettingsSchema);
