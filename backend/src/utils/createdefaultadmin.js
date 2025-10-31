import bcrypt from 'bcryptjs';
import User from '../models/user_model.js';
import { USERNAME, EMAIL, PASSWORD } from '../configs/config.js';

export const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: EMAIL });
    
    if (!existingAdmin) {
      const hashedPassword = bcrypt.hashSync(PASSWORD, 10);
      
      await User.create({
        username: USERNAME,
        email: EMAIL,
        password: hashedPassword,
        profilePicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        isAdmin: true
      });
      
      console.log('✅ Default admin user created successfully!');
    }
  } catch (error) {
    console.log('Error creating admin user:', error.message);
  }
};