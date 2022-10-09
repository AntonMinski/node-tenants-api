const getMongooseQuery = (query) => {
    // const queryFieldsArray = []
    const mongooseQuery = {}
    if (query) {
        if (query.search) {
            mongooseQuery['$or'] = [
                {name: {$regex: query.search, $options: 'i'}},
                {phone: {$regex: query.search, $options: 'i'}},
                {address: {$regex: query.search, $options: 'i'}},
            ];
        }
        switch (query.debt) {
            case 'debt':
                mongooseQuery.debt = { $gt: 0 };
                break
            case 'clear':
                mongooseQuery.debt = { $lte: 0 };
        }
    }
    return mongooseQuery;

}

module.exports = getMongooseQuery;
