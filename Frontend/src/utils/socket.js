import io from "socket.io-client";
import {BASE_URL} from "./constant";
export const createsocketconnectio=()=>{
    return io(BASE_URL);
}