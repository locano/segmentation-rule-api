
const errors = {
	// Specific errors
	1: {
		status: 404,
		errorType: "Not Found",
		errorMsg: "Not found"
	},
	// Common Errors
	400: {
		status: 400,
		errorType: "InvalidRequestException",
		errorMsg: "Invalid Request"
	},
	401: {
		status: 401,
		errorType: "UnauthorizedException",
		errorMsg: "Unauthorized Request"
	},
	404: {
		status: 404,
		errorType: "NotFoundEndpointException",
		errorMsg: "Not Found Endpoint"
	},
	429: {
		status: 429,
		errorType: "OAuthRateLimitException",
		errorMsg: "You made too many requests in 15 min"
	},
	500: {
		status: 500,
		errorType: "UnHandleException",
		errorMsg: "UnHandleException"
	}
};

const throwError = (number, overrideErrorMsg) => {
	if (overrideErrorMsg != null) {
		errors[number]["errorMsg"] = overrideErrorMsg;
	}
	return { ...errors[number], number: number };
};

const catchAllErrors = async (err, req, res, next) => {
	console.log("------>ERROR!");
	console.error(err);
	console.error(err.stack);
	if (err) {
		let e = throwError(500, err.toString());
		res.status(500).json(e);
	}
};


module.exports =  catchAllErrors ;
