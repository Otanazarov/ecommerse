class Pagination {
  constructor(page = 1, paginationLimit = 10) {
    this.currentPage = parseInt(page);  
    this.paginationLimit = parseInt(paginationLimit); 
    this.limit = paginationLimit;
    this.offset = (page - 1) *paginationLimit;
  }
    }
  

module.exports=Pagination