const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = typeof req.user?.role === 'object' ? req.user?.role?.name : req.user?.role;
        if (!req.user || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                success: false,
                message: `Access denied. Role '${userRole}' is not authorized.` 
            });
        }
        next();
    };
};

export { authorizeRoles };