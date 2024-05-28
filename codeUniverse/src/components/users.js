export const users =[];

const storedUsers = JSON.parse(localStorage.getItem('users')) || users;

export const getUsers = () => storedUsers;

export const addUser = (user) => {
    storedUsers.push(user);
    localStorage.setItem('users', JSON.stringify(storedUsers));
};