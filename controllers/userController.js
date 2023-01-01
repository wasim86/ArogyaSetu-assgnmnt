const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const vaccineModel = require("../models/vaccineModel");

const createUser = async function (req, res) {
  try {
    let data = req.body;
    console.log(data);
    let Password = req.body.Password;
    
    const encryptedPassword = await bcrypt.hash(Password, 10);
    data["Password"] = encryptedPassword;
    
    const createUser = await UserModel.create(data);
    return res.status(201).send({ status: true, data: createUser });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const userLogin = async function (req, res) {
  try {
    let data = req.body;
    console.log(data);
    let { PhoneNumber, Password } = data;
    let check = await UserModel.findOne({ PhoneNumber: PhoneNumber });
    console.log(check);
    if (check == null) {
      res.status(404).send({
        status: false,
        message: "this is not a registered PhoneNumber",
      });
    }
    let passwordCheck = await bcrypt.compare(Password, check.Password);
    if (!passwordCheck) {
      return res.status(400).send({
        status: false,
        message: "Password is not a registerd Password",
      });
    }
    let userId = check._id.toString();
    let token = jwt.sign({ userId: userId }, "IamTheBoss", {
      expiresIn: "60s",
    });
    return res.status(200).send({ status: true, userId: userId, data: token });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getVaccineData = async function (req, res) {
  try {
    const getData = await vaccineModel.findOne();
    return res.status(200).send({ status: true, data: getData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const bookSlot = async function (req, res) {
  try {
    let data = req.body["timingSlot"];
    let Dose = req.body.Dose;
    let AadharNo = req.body.AadharNo;

    let getData = await vaccineModel.findOne();
    let UserData = await UserModel.findOne({ AadharNo: AadharNo });
    let SlotBoookedAt= UserData.SlotBoookedAt


    

    let AadharCheck1 = getData.AdharNoOfUsers;
    let AadharCheck2 = getData.SlotsOfTheUsers;
    let availableSlots = getData.availableSlots;
    console.log(AadharCheck1, AadharCheck2);
    let flag = 0;
    let timing;
    let record;
    for (let i = 0; i < AadharCheck1.length; i++) {
      if (AadharNo == AadharCheck1[i]) {
        timing = AadharCheck2[i];
        flag = 1;
        record = i;
        break;
      }
    }
    console.log(flag);
    if (flag == 1) {
      let newSlotBooks=Number(SlotBoookedAt) + Number(120) 
      console.log(newSlotBooks)
      console.log(SlotBoookedAt)
      let newTiming= Date.now()
      console.log(newTiming)
      if(!(newTiming < newSlotBooks)){
        return res.status(400).send({status:false, message:" you can't change the slot timing , you should present at the previous timing only"})
      }

      AadharCheck2.splice(record, 1, data);
      availableSlots[data] += 1;
      availableSlots[timing] += -1;
      let UpdatedData = await vaccineModel.findOneAndUpdate(
        { typeOfVaccine: "CoVaxin" },
        {
          $set: {
            availableSlots: availableSlots,
            SlotsOfTheUsers: AadharCheck2,
          },
        },
        { new: true }
      );
      return res.send({
        status: true,
        message: "updated Successfully",
        data: UpdatedData,
      });
    }

    // let UserData = await UserModel.findOne({ AadharNo: AadharNo });
    let VaccinationStatus = UserData.VaccinationStatus;
    if (VaccinationStatus == "None" && Dose == "secondDose") {
      return res.status(400).send({
        status: false,
        message: " now you should  register for firstDose ",
      });
    } else if (VaccinationStatus == "firstDose" && Dose == "firstDose") {
      return res.status(400).send({
        status: false,
        message: "now you should register for secondDose ",
      });
    }

    // let availableSlots = getData.availableSlots;
    if (availableSlots[data] < 10) {
      let updateUserdata = await userModel.findOneAndUpdate(
        { AadharNo: AadharNo },
        { $set: { VaccinationStatus: Dose,SlotBoookedAt:Date.now() } },
        { new: true }
      );
      availableSlots[data] += 1;
      const update = await vaccineModel.findOneAndUpdate(
        { typeOfVaccine: "CoVaxin" },
        {
          $set: { availableSlots: availableSlots },
          $push: { AdharNoOfUsers: AadharNo, SlotsOfTheUsers: data },
        },
        { new: true }
      );
      return res
        .status(200)
        .send({ status: true, data1: update });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "this slot is not available" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createUser, userLogin, getVaccineData, bookSlot };