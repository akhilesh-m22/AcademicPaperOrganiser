// Generate bcrypt password hashes for sample users
const bcrypt = require('bcrypt');

const password = 'password123'; // Same password for all sample users
const saltRounds = 10;

async function generateHashes() {
    console.log('Generating password hashes...\n');
    
    const users = [
        'Alice Johnson',
        'Bob Smith',
        'Catherine Lee',
        'David Kumar',
        'Emily Brown'
    ];
    
    for (const user of users) {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log(`'${user}': '${hash}',`);
    }
}

generateHashes();
