# cloudstore-manager

## Requirments :
          - node (Latest or Minimum v12)
          - All environment variables configured in .env file and it's located in root or the project where package.json file is located.
          - MySql server running in local. 
[Click to download software that will run MySQL in local](https://dev.mysql.com/downloads/mysql)

## To Run in Local :
##### Step 1 : Open terminal and access MySQL shell by this command ( mysql --user=root --password=your_password )
##### Step 2 : Create dev_db databse with typing this command in shell ( CREATE DATABASE `dev_db`; )
          - Check if dev_db database is created by this command ( show databases; )
##### Step 3 : Open project location in terminal and install all dependencies by this command ( yarn or npm install )
##### Step 4 : To run the development app use this command ( yarn dev or npm run dev )
          - You should see this message in logs ( Express server started 3000. Try some routes, such as '/api/users'. )
## And You can use cloudstore-manager endpoints now.
