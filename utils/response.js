class ApiResponse {
    constructor(data, pagination, error) {
      this.data = data || null;
      this.pagination = pagination ||null;
      this.error = error || null;
      this.date = new Date
    }
  }

  module.exports = ApiResponse