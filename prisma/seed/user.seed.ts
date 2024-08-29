// Define the Gender enum
enum Gender {
  Male = 'male',
  Female = 'female',
}

// Define your users array with the Gender enum
export const users = [
  {
    id: 1,
    name: 'Suos Phearith',
    email: 'suosphearith@gmail.com',
    password: 'Phearith@123',
    gender: Gender.Male,
    roleId: 1,
  },
  {
    id: 2,
    name: 'Rin Darith',
    email: 'rindarith@gmail.com',
    password: 'Darith@123',
    gender: Gender.Male,
    roleId: 1,
  },
];
