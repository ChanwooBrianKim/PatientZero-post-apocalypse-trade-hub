import bcryptjs from 'bcryptjs';

async function generateHash(password) {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    console.log("Hashed Password:", hashedPassword);
}

generateHash("Patient0");
