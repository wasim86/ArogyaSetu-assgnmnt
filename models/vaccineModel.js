const mongoose = require("mongoose");

const vaccineSchema = new mongoose.Schema(
  {
    Name: String,
    typeOfVaccine: { type: String, enum: ["CoVaxin", "Covishield"] },
    VaccineAvailability: String,
    availableSlots: { type: Object },
    openingAndClosingTime: String,
    MaximumDosesForOneSlot: Number,
    AdharNoOfUsers:[String],
    SlotsOfTheUsers:[String]
  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vaccine", vaccineSchema);