const sqlite3 = require("better-sqlite3");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const jwt = require("jsonwebtoken");
const { emailConfig, emailsecret } = require("../secrets");
const { sendAccountActivationEmail, sendPassportResetEmail } = require(
  "./sendMail",
);

exports.signup = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    const DB = new sqlite3("./resumedb.sqlite");
    const getUserStmt = DB.prepare(`SELECT * FROM users WHERE email = ?;`);
    const user = getUserStmt.get(email);
    if (!user) {
      DB.close();
      //send email
      sendAccountActivationEmail(emailConfig, email, password);
      //send message
      res.status(200).json(
        {
          message:
            "Thank you for signing up. We have sent an account activation email. Please activate by clicking the activation link, or by cutting and pasting the link onto the browser address bar.",
        },
      );
    } else {
      res.status(400).json(
        {
          message:
            "The user already exists. Please login. If you forget your password ask for a reset.",
        },
      );
    }
  } else {
    res.status(400).json(
      {
        messate:
          "Passwords and confirm password do not match. Please try again.",
      },
    );
  }
};

exports.activateAccount = (req, res) => {
  const token = req.params.token;
  if (token) {
    jwt.verify(token, emailsecret, (err, decodedToken) => {
      if (err) {
        res.status(400).json(
          { message: "Token seems to be out of order or expired." },
        );
      } else {
        const { email, password } = decodedToken;
        const hashedPassword = bcrypt.hashSync(password, salt);
        const DB = new sqlite3("./resumedb.sqlite");
        const addUserStmt = DB.prepare(
          `INSERT INTO users (email, password) VALUES(?,?);`,
        );
        addUserStmt.run(email, hashedPassword);
        req.session.isLoggedIn = true;
        req.session.email = email;

        DB.close();
        res.status(200).json(
          {
            message:
              `Welcome! Thank you for activating your account, ${email}. You are now logged in.`,
          },
        );
      }
    });
  } else {
    res.status(400).json({ message: "The token has expired" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!req.session.isLoggedIn || req.session.email !== email) {
    if (email && password) {
      const DB = new sqlite3("./resumedb.sqlite");
      const getUserStmt = DB.prepare(`SELECT * FROM users WHERE email = ?;`);
      const user = getUserStmt.get(email);
      if (user) {
        const hashedPassword = user.password;
        bcrypt.compare(password, hashedPassword, (err, result) => {
          if (result === true) {
            req.session.isLoggedIn = true;
            req.session.email = email;
            DB.close();
            res.status(200).json(
              { message: `Welcome, ${email}. You are now logged in.` },
            );
          } else {
            res.status(400).json(
              { message: "Passwords do not match. Please try again." },
            );
          }
        });
      } else {
        res.status(400).json(
          { message: "The user does not exist. Please signup first." },
        );
      }
    } else {
      res.status(400).json({ message: "Both email and password are required" });
    }
  } else {
    res.status(400).json(
      { message: "You or someone else is aready logged in in this browser!" },
    );
  }
};

exports.logout = (req, res) => {
  if (req.session.isLoggedIn && req.session.email) {
    req.session.destroy();
    res.status(200).json(
      { message: `You are logged out. Bye` },
    );
  } else {
    res.status(400).json({ message: "You are not logged in." });
  }
};

exports.deleteUser = (req, res) => {
  if (req.session.isLoggedIn && req.session.email) {
    const email = req.params.email;
    const DB = new sqlite3("./resumedb.sqlite");
    DB.pragma("foreign_keys=ON");
    const deleteUserStmt = DB.prepare(`DELETE FROM users WHERE email = ?;`);
    deleteUserStmt.run(email);
    req.session.destroy();
    DB.close();
    res.status(200).json(
      {
        message:
          "You have removed yourself. You can sign up again when you want. See you again!",
      },
    );
  } else {
    res.status(400).json(
      {
        message:
          "You cannot randomly remove users. You can remove yourself but you have to be signed in for that",
      },
    );
  }
};

//reset password

exports.resetPasswordRequest = (req, res) => {
  const email = req.body.email;
  const DB = new sqlite3("./resumedb.sqlite");
  const getUserStmt = DB.prepare(`SELECT * FROM users WHERE email = ?;`);
  const user = getUserStmt.get(email);
  if (!user) {
    res.status(400).json(
      {
        message:
          "The user with that email does not exist. Maybe you want to signup.",
      },
    );
  } else {
    sendPassportResetEmail(emailConfig, email);
    res.status(200).json(
      {
        message:
          "you have requested to reset your password. If you have done it, please click the link to proceed for resetting password. ",
      },
    );
  }
  //Quite a lot of work here, so I have to go slow and steady!
};

//send reset password form

exports.getResetPasswordForm = (req, res) => {
  const token = req.params.token;
  if (token) {
    jwt.verify(token, emailsecret, (err, decodedToken) => {
      if (err) {
        res.status(400).json({ message: "The token is broken or expired" });
      } else {
        const { email } = decodedToken;
        const DB = new sqlite3("./resumedb.sqlite");
        const getUserStmt = DB.prepare(`SELECT * FROM users WHERE email = ?;`);
        const user = getUserStmt.get(email);
        if (!user) {
          res.status(400).json(
            { message: "The user with the email does not exist" },
          );
        } else {
          res.status(200).json(
            {
              message: "Please fill up the form to reset your password",
              token: token,
            },
            //here render the form to the user to reset
          );
        }
      }
    });
  } else {
    res.status(400).json(
      { message: "The token is invalid or expired. Try again." },
    );
  }
};

//confirm reset password

exports.confirmResetPassword = (req, res) => {
  const token = req.params.token;
  const { password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    if (token) {
      jwt.verify(token, emailsecret, (err, decodedToken) => {
        if (err) {
          res.status(400).json(
            {
              message:
                "The token seems to be broken or expired! Please try again.",
            },
          );
        } else {
          const { email } = decodedToken;
          const DB = new sqlite3("./resumedb.sqlite");
          const getUserStmt = DB.prepare(`SELECT * FROM users WHERE email =?;`);
          const user = getUserStmt.get(email);
          if (user) {
            const hashedPassword = bcrypt.hashSync(password, salt);
            const updateUserStmt = DB.prepare(
              `UPDATE users SET password = ? WHERE email =?;`,
            );
            updateUserStmt.run(hashedPassword, email);
            DB.close();
            res.status(200).json(
              {
                message:
                  "You have successfully rest your password. Proceed to login now.",
              },
            );
          } else {
            DB.close();
            res.status(400).json(
              {
                message:
                  "The user with that email does not exist. Maybe you want to signup first.",
              },
            );
          }
        }
      });
    } else {
      res.status(400).json({ message: "The token is broken or has expired." });
    }
  } else {
    res.status(400).json(
      { message: "Passwords do not match. Please try again." },
    );
  }
};

exports.createProfile = (req, res) => {
  if (req.session.isLoggedIn && req.session.email) {
    const email = req.session.email;
    const { bio } = req.body;
    //check if profile with that email exists
    const DB = new sqlite3("./resumedb.sqlite");
    const getProfileStmt = DB.prepare(
      `SELECT * FROM profiles WHERE userEmail = ?;`,
    );
    const profile = getProfileStmt.get(email);
    if (!profile) {
      const createProfileStmt = DB.prepare(
        `INSERT INTO profiles (userEmail, bio) VALUES(?,?);`,
      );
      createProfileStmt.run(email, bio);
      DB.close();
      res.status(200).json(
        { message: `Thank you for creating your profile, ${email}` },
      );
    } else {
      res.status(400).json(
        { message: "You have already created your profile." },
      );
    }
  } else {
    res.status(400).json(
      { message: "You have to be logged in to create profile. Please login." },
    );
  }
};

exports.getUserProfile = (req, res) => {
  if (req.session.isLoggedIn && req.session.email) {
    const email = req.session.email;
    const DB = new sqlite3("./resumedb.sqlite");
    const getProfileStmt = DB.prepare(
      `SELECT * FROM profiles WHERE userEmail = ?;`,
    );
    const profile = getProfileStmt.get(email);
    if (profile) {
      DB.close();
      res.status(200).json(profile);
    } else {
      res.status(400).json({ message: "Profile does not exist. " });
    }
  } else {
    res.status(400).json(
      { message: "You need to be logged in to get your profile" },
    );
  }
};

exports.updateProfile = (req, res) => {
  if (req.session.isLoggedIn && req.session.email) {
    const DB = new sqlite3("./resumedb.sqlite");
    const email = req.session.email;
    const bio = req.body.bio;
    const updateProfileStmt = DB.prepare(
      `UPDATE profiles SET bio = ? WHERE userEmail = ?`,
    );
    updateProfileStmt.run(bio, email);
    DB.close();
    res.status(200).json(
      { message: `You have successfully updated your bio, ${email}` },
    );
  } else {
    res.status(400).json(
      { message: "You have to be logged in to update profile" },
    );
  }
};

exports.deleteProfile = (req, res) => {
  if (req.session.isLoggedIn && req.session.email) {
    const email = req.session.email;
    const DB = new sqlite3("./resumedb.sqlite");
    const deleteProfileStmt = DB.prepare(
      `DELETE FROM profiles WHERE userEmail = ?;`,
    );
    deleteProfileStmt.run(email);
    DB.close();
    res.status(200).json(
      {
        message:
          `You have removed your profile, ${email}. You can create it later again if and when you wish. Thank you.`,
      },
    );
  } else {
    res.status(400).json(
      { message: "You have to be logged in to delete your profile." },
    );
  }
};
