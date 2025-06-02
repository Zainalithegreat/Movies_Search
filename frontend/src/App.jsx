import './App.css'
import Home from "./pages/Home";
import {Routes, Route} from "react-router-dom";
import NavBar from "./components/NavBar";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useState } from "react";

function App() {
    return (
            <>
            <NavBar />
            <main className="main-content">
                <Routes>

                    <Route element={<PrivateRoute />}>
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/" element={<Home />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </main>
        </>
    );
}

export default App
