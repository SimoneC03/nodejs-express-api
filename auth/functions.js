const jwt = require('jsonwebtoken')

const Auth = {
    validateToken: function(token) {
        if(token === undefined || token === null || token === '' || token === "") {
            return false;
        }
        else {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                return decoded
            }
            catch {
                return false
            }
        }
    }

}

module.exports = Auth