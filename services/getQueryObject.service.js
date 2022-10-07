const getMongooseQuery = (query) => {
const mongooseQuery = {};
    if (query) {
        if (query.name) {
            mongooseQuery.name = query.name;
        }
        if (query.debt === 'true') {
            mongooseQuery.financialDebt = { $gt: 0 };
        } else if (query.debt === 'false') {
            mongooseQuery.financialDebt = 0;
        }
    }
    return mongooseQuery;

}

module.exports = getMongooseQuery;