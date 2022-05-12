import { http } from "@/core/services/http-common";

export class GuardiansService {
  getAll() {
    return http.get("/guardians");
  }

  getById(id) {
    return http.get(`/guardians/${id}`);
  }

  create(data) {
    return http.post("/guardians", data);
  }

  update(id, data) {
    return http.put(`/guardians/${id}`, data);
  }

  delete(id) {
    return http.delete(`/guardians/${id}`);
  }
}
