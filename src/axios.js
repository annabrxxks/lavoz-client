import axios from "axios"

export const makeRequest = axios.create({
    baseURL: "https://lavoz-sql-6ee4ddacedb3.herokuapp.com/api/",
    withCredentials: true,
});