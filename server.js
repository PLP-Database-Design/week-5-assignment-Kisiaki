//Importing models and Basic server.js setup 
const express = require("express")
const app = express()
const dotenv = require("dotenv")
const mysql = require("mysql2")


//Configuring the database connection and test the connection
dotenv.config()

const db = mysql.createConnection({
    user:process.env.DB_USERNAME,
    host:process.env.DB_HOST,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
})

//Testing connection
db.connect((err)=>{
    //Connection Unsuccessfully
    if(err){
        return console.log("Error connecting to the databse:" , + err)
    }
    // Connection Successfully
    console.log("Connected Successfully to DB:" , db.threadId) 
})

//Question 1: Retrieve all patients
app.get("/patients", (req , res) =>{
    
    // SQL query to retrieve patients by patient_id, first name, last_name, and date_of_birth
    const retrievePatient = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
    
    db.query(retrievePatient, (err , data)=>{
        // if failed to return patients due to error
        if(err){
            return res.status(400).send("Failed to retrieve patients details", + err)
        }
        res.status(200).send(data)

    })
})

//Question 2: Retrieve all providers
app.get("/providers", (req , res) =>{
    
    // SQL query to retrieve patients by first name, last_name, provider_specialty
    const retrieveProviders = "SELECT  first_name, last_name, provider_specialty FROM providers"
    
    db.query(retrieveProviders, (err , data)=>{
        // if failed to return providers due to error
        if(err){
            return res.status(400).send("Failed to retrieve providers details", + err)
        }
        res.status(200).send(data)

    })
})

//Question 3: Filter patients by First Name
app.get("/patients/firstName", (req, res) => {
    // Get the first name from the query parameters
    const firstName = req.query.firstName; // e.g., /patients/firstName?firstName=John

    // Ensure the first name is provided
    if (!firstName) {
        return res.status(400).send("First name is required.")
    }

    // SQL query to retrieve patients by first name
    const retrievePatientsByFirstName = "SELECT * FROM patients WHERE first_name = ?"

    // Execute the query
    db.query(retrievePatientsByFirstName, [firstName], (err, data) => {
        // If there's an error, return a 400 status
        if (err) {
            return res.status(400).send("Failed to retrieve patients by first name: " + err)
        }

        // If successful, send the retrieved data
        res.status(200).send(data)
    });
});


//Question 4:  Retrieve all providers by their specialty

app.get("/providers/specialty", (req, res) => {
    // Get the specialty from the query parameters
    const specialty = req.query.specialty // e.g., /providers/specialty?specialty=Cardiology

    // Ensure the specialty is provided
    if (!specialty) {
        return res.status(400).send("Specialty is required.")
    }

    // SQL query to retrieve providers by specialty
    const retrieveProvidersBySpecialty = "SELECT * FROM providers WHERE provider_specialty = ?"

    // Execute the query
    db.query(retrieveProvidersBySpecialty, [specialty], (err, data) => {
        // If there's an error, return a 400 status
        if (err) {
            return res.status(400).send("Failed to retrieve providers by specialty: " + err)
        }

        // If successful, send the retrieved data
        res.status(200).send(data)
    });
});


//listen to the server
const port = 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost: ${port}`)
})