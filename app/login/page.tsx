"use client";
import axios from "@/utils/axios-instance";

import { useState, useEffect } from "react";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // component on mount
  useEffect(() => {
    const user = window.localStorage.getItem("user_data_e");
    if (user) {
      const parsed_user = JSON.parse(user);
      if (Object.keys(parsed_user).length === 0) {
        return;
      }
      for (const key in parsed_user) {
        if (parsed_user[key] === "") {
          return;
        }
      }
      // check object properties
      const expires = new Date(parsed_user.expiresAt);
      const now = new Date();
      if (expires > now) {
        window.location.href = "/dashboard";
      }

      // check token
      axios
        .post("/api/user/token/refresh", {
          refresh: parsed_user.refreshToken,
        })
        .then((res) => {
          parsed_user.accessToken = res.data.access;
          parsed_user.expiresAt = res.data.expiresAt;
          window.localStorage.setItem(
            "user_data_e",
            JSON.stringify(parsed_user)
          );
          window.location.href = "/dashboard";
        });
    }
  }, []);

  const login = async () => {
    const { email, password } = user;

    if (email === "" || password === "") {
      return;
    }

    const response = await axios.post(
      "/api/user/token/obtain/",
      JSON.stringify(user)
    );

    // user işlemleri gerçekleşecek
  };

  return (
    <div className="text-white flex flex-col items-center justify-center h-screen bg-gradient-to-r">
      <h1
        className="text-5xl font-bold mb-10"
        style={{ textShadow: "0 0 10px rgba(0, 0, 0, 0.5" }}
      >
        Giriş Yap
      </h1>

      <div className="flex flex-col items-center justify-center border border-gray-600 p-20">
        <input
          type="text"
          placeholder="E-posta"
          className="bg-transparent border-b-2 border-white mb-12 text-center text-xl text-white mt-4 outline-none"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          value={user?.email}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-transparent border-b-2 border-white mb-12 text-center text-xl text-white mt-4 outline-none"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          value={user?.password}
        />
        <button
          type="submit"
          className="bg-white text-black py-2 px-10 rounded-full text-xl font-bold mt-4"
          onClick={login}
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
}
