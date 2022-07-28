import axios from 'axios'
import Config from "./config.json";

export default axios.create({ 
  baseURL: Config.BASE_URL,
})