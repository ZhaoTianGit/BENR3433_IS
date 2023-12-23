const mongoose = require('mongoose');
const { Visit } = require('../model/user'); 

mongoose.connect('mongodb+srv://codecinnpro:9qLtJIAG9k8G1Pe8@cluster0.egrjwh1.mongodb.net/vms_2?retryWrites=true&w=majority',{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

//function to randomly generate a number
function getRandomPurpose() {
    const purposes = ['Meeting', 'Interview', 'Appointment', 'Event', 'Visit'];
    const randomIndex = Math.floor(Math.random() * purposes.length);
    const randomPurpose = purposes[randomIndex];
    return randomPurpose;
}

function getRandomPhoneNumber() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
}

function getRandomVisitTime() {
    const startTimestamp = new Date('2022-01-01').getTime();
    const endTimestamp = new Date().getTime();
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    return new Date(randomTimestamp);
}

// const seedDb = async()=>{
//     try {
        
//         for (let i = 0; i < 5; i++) {
//             const randomVisit = new Visit({
//                 purposeOfVisit: `'${getRandomPurpose()}'`,
//                 phoneNumber: getRandomPhoneNumber(),
//                 visitTime: getRandomVisitTime(),
//                 // Add more properties as needed
//             });
//             console.log(randomVisit);
//             await randomVisit.save();
//         }
    
//         console.log('Random visits saved to MongoDB');
//     } catch (error) {
//         console.error('Error saving random visits to MongoDB:', error);
//     }    
// }


// seedDb().then(()=>{
//     mongoose.connection.close();
// })


// Function to delete all documents in the 'visits' collection
async function deleteAllVisits() {
    try {
        // Use the deleteMany method to remove all documents in the collection
        await Visit.deleteMany({});

        console.log('All visits deleted successfully');
    } catch (error) {
        console.error('Error deleting visits:', error);
    } finally {
        // Disconnect from the database after deleting
        mongoose.connection.close();
    }
}

// Call the deleteAllVisits function to remove all documents
deleteAllVisits();