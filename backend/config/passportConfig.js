// config/passportConfig.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const Patient = require('../models/Patient');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback', // Updated to include /api
    scope: ['profile', 'email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let patient = await Patient.findOne({ where: { googleId: profile.id } });
      if (!patient) {
        patient = await Patient.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          isVerified: true,
        });
      }
      done(null, patient);
    } catch (error) {
      done(error, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Patient.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;