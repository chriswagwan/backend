const CompanySettings = require("../models/CompanySettings");
const asyncHandler = require("../utils/asyncHandler");

const defaultSettings = {
  companyName: "Civil Works Co.",
  companyTagline: "Building infrastructure with confidence",
  contactEmail: "hello@civilworksco.com",
  contactPhone: "+20 100 555 0099",
  addressLine1: "Nasr City, Cairo",
  addressLine2: "Egypt",
  officeHours: "Sunday - Thursday, 8:00 AM - 5:00 PM",
  contactIntro:
    "Tell us about your project scope, location, or tender requirements and our team will get back to you.",
  footerSummary:
    "We deliver civil infrastructure, buildings, and utility projects with disciplined execution, dependable quality, and long-term value.",
};

const getOrCreateSettings = async () => {
  let settings = await CompanySettings.findOne();

  if (!settings) {
    settings = await CompanySettings.create(defaultSettings);
  }

  return settings;
};

const getCompanySettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json(settings);
});

const updateCompanySettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  Object.keys(defaultSettings).forEach((key) => {
    if (req.body[key] !== undefined) {
      settings[key] = req.body[key];
    }
  });

  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});

module.exports = {
  getCompanySettings,
  updateCompanySettings,
};
