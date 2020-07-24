const sqlite3 = require("better-sqlite3");
const DB = new sqlite3("./resumedb.sqlite");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const jwt = require("jsonwebtoken");
const { emailConfig, emailsecret } = require("../secrets");
const { sendAccountActivationEmail, sendPassportResetEmail } = require(
  "./sendMail",
);
process.on("exit", () => {
  DB.close();
});

exports.signup = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    const getUserStmt = DB.prepare(`SELECT * FROM users WHERE email = ?;`);
    const user = getUserStmt.get(email);
    if (!user) {
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
      res.status(200).json(
        {
          message: "UserExistsError",
        },
      );
      console.log("user already exists");
    }
  } else {
    res.status(400).json(
      {
        message: "PasswordsMisMatch",
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

        const addUserStmt = DB.prepare(
          `INSERT INTO users (email, password) VALUES(?,?);`,
        );
        addUserStmt.run(email, hashedPassword).lastInsertRowid;

        res.status(200);
        res.send(`<h3>Your account is activated, ${email}</h3>`);
      }
    });
  } else {
    res.status(400).json({ message: "The token has expired" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const getUserStmt = DB.prepare(`SELECT * FROM users WHERE email = ?;`);
  const user = getUserStmt.get(email);
  if (user) {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(401).json({ message: "Invalid credentials" });
      } else if (result === true) {
        req.session.user = user;
        req.session.isLoggedIn = true;
        res.status(200).json({
          loggedInUser: {
            email: req.session.user.email,
            adminStatus: req.session.user.is_admin,
            isLoggedIn: req.session.isLoggedIn,
          },
        });
      } else {
        res.status(500).json({ message: "Problem logging in user" });
      }
    });
  } else {
    res.status(401).json({ message: "UserDoesNotExist" });
  }
};

exports.logout = (req, res) => {
  //   if (req.session.isLoggedIn === true) {
  req.session.destroy();
  res.status(200).json(
    { message: `You are logged out. Bye` },
  );
  //   } else {
  // res.status(400).json({ message: "You are not logged in." });
  //   }
};

exports.deleteUser = (req, res) => {
  if (req.session.isLoggedIn && req.session.email) {
    const email = req.params.email;

    DB.pragma("foreign_keys=ON");
    const deleteUserStmt = DB.prepare(`DELETE FROM users WHERE email = ?;`);
    deleteUserStmt.run(email);
    req.session.destroy();

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

          const getUserStmt = DB.prepare(`SELECT * FROM users WHERE email =?;`);
          const user = getUserStmt.get(email);
          if (user) {
            const hashedPassword = bcrypt.hashSync(password, salt);
            const updateUserStmt = DB.prepare(
              `UPDATE users SET password = ? WHERE email =?;`,
            );
            updateUserStmt.run(hashedPassword, email);

            res.status(200).json(
              {
                message:
                  "You have successfully rest your password. Proceed to login now.",
              },
            );
          } else {
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

    const getProfileStmt = DB.prepare(
      `SELECT * FROM profiles WHERE userEmail = ?;`,
    );
    const profile = getProfileStmt.get(email);
    if (!profile) {
      const createProfileStmt = DB.prepare(
        `INSERT INTO profiles (userEmail, bio) VALUES(?,?);`,
      );
      createProfileStmt.run(email, bio);

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

    const getProfileStmt = DB.prepare(
      `SELECT * FROM profiles WHERE userEmail = ?;`,
    );
    const profile = getProfileStmt.get(email);
    if (profile) {
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
    const email = req.session.email;
    const bio = req.body.bio;
    const updateProfileStmt = DB.prepare(
      `UPDATE profiles SET bio = ? WHERE userEmail = ?`,
    );
    updateProfileStmt.run(bio, email);

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

    const deleteProfileStmt = DB.prepare(
      `DELETE FROM profiles WHERE userEmail = ?;`,
    );
    deleteProfileStmt.run(email);

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
