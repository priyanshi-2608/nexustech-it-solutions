const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(cors());
app.use(express.json());
app.use("/uploads",express.static('uploads'));

app.use("/api/services",require("./routes/serviceRoutes"));
app.use("/api/team",require("./routes/teamMemberRoutes"));
app.use("/api/jobs",require("./routes/jobRoutes"));
app.use("/api/blogs",require("./routes/blogRoutes"));
app.use("/api/faqs",require("./routes/faqRoutes"));
app.use("/api/contact",require("./routes/contactRoutes"));
app.use("/api/applications",require("./routes/jobApplicationRoutes"));
app.use("/api/admin",require("./routes/adminRoutes"));
app.use("/api/technologies",require("./routes/technologyRoutes"));
app.use("/api/projects",require("./routes/projectRoutes"));
app.use("/api/testimonials",require("./routes/testimonialRoutes"));

app.get("/",(req,res)=>{
    res.send("IT Company Website API is running");
});

app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`);
});