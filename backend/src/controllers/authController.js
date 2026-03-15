const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret-key-replace-this', {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d'
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role
        });

        createSendToken(newUser, 201, res);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        console.log(`LOGIN ATTEMPT: ${email} as ${role}`);

        // 1) Check if email and password exist
        if (!email || !password || !role) {
            console.log('LOGIN FAIL: Missing fields');
            return next(new AppError('Please provide email, password and role!', 400));
        }
        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            console.log(`LOGIN FAIL: Invalid credentials for ${email}`);
            return next(new AppError('Incorrect email or password', 401));
        }

        // 3) Check if role matches
        if (user.role !== role) {
            console.log(`LOGIN FAIL: Role mismatch for ${email}. Expected ${user.role}, got ${role}`);
            // Use generic message to prevent information leakage (OWASP Best Practice)
            return next(new AppError('Incorrect email or password', 401));
        }

        console.log(`LOGIN SUCCESS: ${email}`);
        // 4) If everything ok, send token to client
        createSendToken(user, 200, res);
    } catch (err) {
        console.error('LOGIN ERROR:', err);
        next(err);
    }
};

exports.protect = async (req, res, next) => {
    try {
        // 1) Getting token and check of it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            console.log('PROTECT FAIL: No token found');
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }

        // 2) Verification token
        console.log('PROTECT: Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key-replace-this');
        console.log('PROTECT: Token verified for user ID:', decoded.id);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist.', 401));
        }

        // 4) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password! Please log in again.', 401));
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (err) {
        next(err);
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'faculty']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateUserStatus = async (req, res, next) => {
    try {
        const userToUpdate = await User.findById(req.params.id);
        
        if (!userToUpdate) {
            return next(new AppError('No user found with that ID', 404));
        }

        // PROTECTION: Prevent modifying Super Admin status
        if (userToUpdate.email === 'admin@institution.edu') {
            return next(new AppError('The Super Admin account cannot be modified.', 403));
        }

        userToUpdate.status = req.body.status;
        await userToUpdate.save();

        res.status(200).json({
            status: 'success',
            data: {
                user: userToUpdate
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role || 'faculty',
            status: 'Active' // Manually created users by admin are active by default
        });

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    } catch (err) {
        next(err);
    }
};
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.updateMe = async (req, res, next) => {
    try {
        // 1) Create error if user POSTs password data
        if (req.body.password || req.body.passwordConfirm) {
            return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
        }

        // 2) Filtered out unwanted fields names that are not allowed to be updated
        // Allow updating name and settings
        const filteredBody = filterObj(req.body, 'name', 'settings');
        
        // Handle nested settings object if provided as a separate field or string
        if (req.body.settings && typeof req.body.settings === 'object') {
            filteredBody.settings = {
                ...req.user.settings,
                ...req.body.settings
            };
        }

        // 3) Update user document
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        // 1) Get user from collection
        const user = await User.findById(req.user.id).select('+password');

        // 2) Check if posted current password is correct
        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            return next(new AppError('Your current password is wrong', 401));
        }

        // 3) If so, update password
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        // 4) Log user in, send JWT
        createSendToken(user, 200, res);
    } catch (err) {
        next(err);
    }
};
