import axios from "axios"

class ApiService {
  private baseUrl: string = 'https://backend-iut-badge.onrender.com'

  getEtudiantsDB(){
    return axios.get(`${this.baseUrl}/db/etudiants`)
  }

  getCountEtudiantsDB(){
    return axios.get(`${this.baseUrl}/db/count-etudiants`)
  }

}

const api = new ApiService()

export default api
