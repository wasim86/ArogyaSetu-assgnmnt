const express= require("express")
const route= require("./routes/route.js")
const {default:mongoose}= require("mongoose")
mongoose.set('strictQuery', false)
const app= express()

app.use(express.json())

mongoose.connect("mongodb+srv://Wasim:sjdwsm86@mycluster.hazwc4e.mongodb.net/ArogyaSetu",{
    useNewUrlParser: true
})
.then(()=> console.log("mongoDB is connected"))
.catch((err=> console.log(err)))


app.use("/",route)

app.listen(process.env.PORT || 3000, function(){
    console.log("express app is running on port" +(process.env.PORT || 3000))
})