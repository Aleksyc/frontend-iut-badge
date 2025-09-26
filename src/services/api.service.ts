import axios from "axios"

class ApiService {
  private baseUrl: string = 'https://backend-iut-badge.onrender.com'

  getEtudiantsDB(){
    return axios.get(`${this.baseUrl}/db/etudiants`)
  }

  deleteEtudiantDB(id_etu: number){
    return axios.delete(`${this.baseUrl}/db/etudiants/${id_etu}`)
  }

  getCountEtudiantsDB(){
    return axios.get(`${this.baseUrl}/db/count-etudiants`)
  }

  getEtudiantsPresencesDB(){
    return axios.get(`${this.baseUrl}/db/etudiants-presences`)
  }

  getCountDayDB(){
    return axios.get(`${this.baseUrl}/db/count-day`)
  }

  getCountWeekDB(){
    return axios.get(`${this.baseUrl}/db/count-week`)
  }

}

const api = new ApiService()

export default api
