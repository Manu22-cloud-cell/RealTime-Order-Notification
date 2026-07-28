const errorHandler = (err, req, res) => {
    console.error("Error:", err);

    /*
    * Sequelize validation errors
    * Examples:
    * * Required field is missing
    * * Invalid ENUM value
        */

    if (err.name === "SequelizeValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: err.errors.map(
                (error) => error.message
            ),
        });
    }

    /*
    
    * Sequelize database errors
      */

    if (err.name === "SequelizeDatabaseError") {
        console.error("Database error:", err);

        return res.status(500).json({
            success: false,
            message: "Database error",
        });
    }

    /*
    
    * Default error response
      */

    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};

module.exports = errorHandler;
