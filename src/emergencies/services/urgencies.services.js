import { http } from "@/core/services/http-common";

export class UrgenciesServices {
  getAll() {
    return http.get("/urgencies");
  }

  getById(id) {
    return http.get(`/urgencies/${id}`);
  }

  getByGuardianId(id) {
    return http.get(`/guardians/${id}/urgencies`);
  }

  create(data) {
    return http.post("/urgencies", data);
  }

  update(id, data) {
    return http.put(`/urgencies/${id}`, data);
  }

  delete(id) {
    return http.delete(`/urgencies/${id}`);
  }
}
