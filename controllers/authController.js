const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../utils/db');


exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // ✅ Ensure password is hashed
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    const pool = await poolPromise;
    await pool.request()
      .input('name', name)
      .input('email', email)
      .input('phone', phone)
      .input('password', hashedPassword) // ✅ Store the HASHED password, not plaintext
      .query(`INSERT INTO Users (name, email, phone, password) 
              VALUES (@name, @email, @phone, @password)`);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};



//   try {
//     const pool = await poolPromise;


//     const result = await pool.request()
//       .input('email', email)
//       .query(`SELECT * FROM Users WHERE email = @email`);

//     const user = result.recordset[0];
     
//     if (!user) return res.status(401).json({ error: 'Invalid credentials1' });
    

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ error: 'Invalid credentials2' });
    
//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     console.log("token casediary",token);
//     res.json({ token, user: { id: user.id, name: user.name, email: user.email } });

//   } catch (err) {
//     console.error('Login Error:', err);
//     res.status(500).json({ error: 'Server Error' });
//   }
// };


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', email)
      .query(`SELECT * FROM Users WHERE email = @email`);

    const user = result.recordset[0];
    console.log('User found:', user ? user.email : 'none')
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
     console.log('Stored hash:', user.password); 

    
    const isBcryptHash = user.password.startsWith('$2a$');
    let match;
    
    if (isBcryptHash) {
      match = await bcrypt.compare(password, user.password);
    } else {
      match = (password === user.password);  
    }
      console.log('Password match:', match); 

    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};