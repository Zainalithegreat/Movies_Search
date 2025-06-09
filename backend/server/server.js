import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import bcrypt from 'bcrypt';
import fs from 'fs';


const connection =  {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME
};

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB once on startup
sql.connect(connection).then((p) => {
    console.log("✅ Connected to SQL Server");
}).catch(err => {
    console.error("❌ Failed to connect:", err.message);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log(`🔐 Login attempt: ${username}`);

    try {
        const user = await fetchUser(username, password);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

app.post('/register', async (req, res) => {
    const { user, email, username, password } = req.body;

    const userCheck = await checkUser(username)

    if (!userCheck){
        res.status(401).json({ success: false, message: 'User exists' });
    }else{
        const users = await insertUser(user, email, username, password);
        if (users){
            res.json({ success: true, user });
        }
    }
})

app.post('/home', async (req, res) => {
    const {movies, movieTitle, movieRelease, moviePath, username} = req.body;
    console.log(req.body)

    const userID = await getUserID(username);
    const {UserID} = userID

    console.log(UserID)
    const checkFav = await checkFavorite(movieTitle, UserID)
    if (checkFav){
        const insertSuccess = await insertFavorite(UserID, movies, movieTitle, movieRelease, moviePath)
        if (insertSuccess) {
            res.json({success: true, movieTitle});
        }
    }else{
        res.status(401).json({ success: false, message: 'Already Saved' });
    }
})

app.post("/favorites", async (req, res) => {
    const {user} = req.body;
    console.log(req.body)
    const userID = await getUserID(user);
    const {UserID} = userID

    const favs = await retrieveFavorites(UserID)
    console.log(favs)
    if (favs){
        res.json({ success: true, favs });
    }
})

app.post("/remove", async (req, res) => {
    const {movies, username} = req.body;
    const userID = await getUserID(username);
    const {UserID} = userID

    const remove = await removeFavorites(UserID, movies)
    if (remove){
        res.json({ success: true, movies });
    }

})

async function removeFavorites(UserID, movies) {
    const request = new sql.Request()
    request.input('title', sql.VarChar, movies);
    request.input('UserID', sql.INT, UserID)

    const result = await request.query(`
            DELETE From Favorites
            Where UserID = @UserID And title = @title
    `)

    return true
}

async function checkFavorite(movieTitle, UserID){
    const request = new sql.Request()
    request.input('title', sql.VarChar, movieTitle);
    request.input('UserID', sql.INT, UserID)

    const result = await request.query(`
        Select title, UserID
        From Favorites
        Where title = @title AND UserID = @UserID
    `)

    const row = result.recordset[0];
    console.log(row)
    if(row){
        return false
    }
    return true;

}

async function retrieveFavorites(UserID) {
    const request = new sql.Request()
    request.input('UserID', sql.INT, UserID)

    const result = await request.query(`
        Select title, date, MovieID, PosterPath
        From Favorites
        Where UserID = @UserID  
    `)

    const row = result.recordset;
    return row
}

async function getUserID(username){
    const request = new sql.Request()
    request.input('username', sql.VarChar, username);

    const result = await request.query(`
        Select UserID
        From Users
        Where Username = @username
    `);

    const row = result.recordset[0];
    return row

}

async function insertFavorite(UserID, movies, movieTitle, movieRelease,  moviePath){
    const request = new sql.Request()
    request.input('UserID', sql.INT, UserID);
    request.input('MovieID', sql.INT, movies);
    request.input('title', sql.VarChar, movieTitle);
    request.input('date', sql.VarChar, movieRelease);
    request.input('PosterPath', sql.VarChar, moviePath);

    const result = await request.query(`
        INSERT INTO Favorites (UserID, title, date, MovieID, PosterPath)
        VALUES (@UserId, @title, @date, @MovieID, @PosterPath)
    `)

    return true
}

async function fetchUser(username, password) {
    const request = new sql.Request()
    request.input('username', sql.VarChar, username);

    const result = await request.query(`
        SELECT Username, Password
        FROM Users
        WHERE Username = @username
    `);

    const row = result.recordset[0];
    if (row && await bcrypt.compare(password, row.Password)) {
        return { username: row.Username };
    } else {
        return null;
    }
}

async function checkUser(username){
    const request = new sql.Request()
    request.input('username', sql.VarChar, username);

    const result = await request.query(`
        Select Username
        From Users
        WHERE Username = @username
    `)

    const row = result.recordset[0];

    if (row){
        return false
    }
    return true
}

async function insertUser(name,email,username,password) {
    console.log("name: ", name);
    console.log("username: ", username);
    console.log("email: ", email);
    console.log("password: ", password);

    const hashedPassword = await bcrypt.hash(password, 10);
    const request = new sql.Request()

    request.input('name', sql.VarChar, name);
    request.input('email', sql.VarChar, email);
    request.input('username', sql.VarChar, username);
    request.input('password', sql.VarChar, hashedPassword);

    await request.query(`
            INSERT INTO Users (Name, Email, Username, Password)
            VALUES (@name, @email, @username, @password)
        `);

    return true
}

app.listen(3001, () => {
    console.log("🚀 Server running on http://localhost:3001");
});

