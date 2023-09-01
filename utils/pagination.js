class Pagination {
  constructor(items = 0, limit = 15, page = 1) {
      limit = parseInt(limit);
      page = parseInt(page);
      this.limit = limit;
      this.offset = (page - 1) * limit;
      this.currentPage = page;
      this.items = items;
      this.pages = Math.ceil(items / limit);
  }
}

module.exports=Pagination