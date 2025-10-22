import axios from "axios"

class ApiService {
  private baseUrl: string = 'http://127.0.0.1:8000'

  createEtudiantDB(payload: Record<string, unknown>){
    return axios.post(`${this.baseUrl}/db/etudiants`, payload)
  }

  getEtudiantsDB(){
    return axios.get(`${this.baseUrl}/db/etudiants`)
  }

  getEtudiantDetailsDB(id_etu: number){
    return axios.get(`${this.baseUrl}/db/etudiants/${id_etu}`)
  }

  getEtudiantHistoryDB(id_etu: number){
    return axios.get(`${this.baseUrl}/db/etudiants/${id_etu}/presences`)
  }

  updateEtudiantDB(id_etu: number, payload: Record<string, unknown>){
    return axios.put(`${this.baseUrl}/db/etudiants/${id_etu}`, payload)
  }

  deleteEtudiantDB(id_etu: number){
    return axios.delete(`${this.baseUrl}/db/etudiants/${id_etu}`)
  }

  getCountEtudiantsDB(){
    return axios.get(`${this.baseUrl}/db/count-etudiants`)
  }

  getCountEtudiantsActifsDB(){
    return axios.get(`${this.baseUrl}/db/count-etudiants-actifs`)
  }

  postSearchEtudiantDB(dict: Record<string, string>){
    return axios.post(`${this.baseUrl}/db/search-etudiants`, dict)
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
