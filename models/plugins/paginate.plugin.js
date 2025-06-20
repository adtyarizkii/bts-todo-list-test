/* eslint-disable no-param-reassign */

const paginate = (schema) => {
    /**
     * Query for documents with pagination
     * @param {Object} [filter] - Mongo filter
     * @param {Object} [options] - Query options
     * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
     * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @property {Document[]} results - Results found
     * @property {number} page - Current page
     * @property {number} limit - Maximum number of results per page
     * @property {number} totalPages - Total number of pages
     * @property {number} totalResults - Total number of documents
     * @returns {Promise<QueryResult>}
     */
  
    schema.statics.paginate = async function (filter, options, type = "find") {
  
      // show only data not deleted and soft deleted
      Object.assign(filter, { isDeleted: false });
  
      // filter for sorting ascending and descending
      let sort = "";
      if (options.sortBy) {
        const sortingCriteria = [];
        options.sortBy.split(",").forEach((sortOption) => {
          const [key, order] = sortOption.split(":");
          sortingCriteria.push((order === "desc" ? "-" : "") + key);
        });
        sort = sortingCriteria.join(" ");
      } else {
        sort = "createdAt";
      }
  
      // limit, page, and skip data
      const limit =
        options.limit && parseInt(options.limit, 10) > 0
          ? parseInt(options.limit, 10)
          : 10;
      const page =
        options.page && parseInt(options.page, 10) > 0
          ? parseInt(options.page, 10)
          : 1;
      const skip = (page - 1) * limit;
  
      let countPromise, docsPromise;
      
      // query for data
      if (type == 'aggregate') {
        filter.push({ $setWindowFields: { output: { totalData: { $count: {} } } } })
        docsPromise = this.aggregate(filter)
      } else {
        // count all data after filter
        countPromise = this.countDocuments(filter).exec()
        docsPromise = this.find(filter)
      }
      docsPromise = docsPromise.sort(sort).skip(skip).limit(limit)
  
      // populate data with relations collection if type is find
      if (options.populate && type == "find") {
        const buildPopulate = (populateOption) => {
          const [path, ...rest] = populateOption.split(".");
  
          if (rest.length > 0) {
            return { path, populate: buildPopulate(rest.join(".")) };
          }
  
          if (path.includes(":")) {
            const [p, select] = path.split(":");
            return { path: p, select };
          }
  
          return { path };
        };
  
        options.populate.split(",").forEach((populateOption) => {
          docsPromise = docsPromise.populate(buildPopulate(populateOption));
        });
      }
  
      docsPromise = docsPromise.exec();
  
      return Promise.all([countPromise, docsPromise]).then((values) => {
        let [totalAllData, results] = values;
        if (type == 'aggregate') {
          totalAllData = results[0]?.totalData || 0
        }
        
        const totalPages = Math.ceil(totalAllData / limit);
        const totalData = Math.ceil(totalAllData);
        const totalResults = results.length;
        const result = {
          results,
          page,
          limit,
          totalPages,
          totalResults,
          totalData,
        };
        return Promise.resolve(result);
      });
    };
  };
  
  module.exports = paginate;
  