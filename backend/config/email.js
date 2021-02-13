const registerEmailParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email]
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
          <html>
            <body>
              <h1>Verify your email address</h1>
              <p>Please click the following link to complete your registration:</p>
              <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            </body>
          </html>`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Complete Your Registration'
      }
    }
  };
};

const forgotPasswordEmailParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email]
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
          <html>
            <body>
              <h1>Reset Password</h1>
              <p>Please click the following link to reset your password:</p>
              <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
            </body>
          </html>`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Reset Your Password'
      }
    }
  };
};

const linkPublishedParams = (email, data) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email]
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
          <html>
            <body>
              <h1>New Link Published | The Website</h1>
              <p>You might be interested in this new link posted.  It is called ${data.title}.</p>
              
              ${data.categories.map((category) => {
                return `
                  <div>
                    <h2>${category.name}</h2>
                    <img src="${category.image.url}" alt="${category.name}" style="height:50px;" />
                    <h3><a href="${process.env.CLIENT_URL}/links/${category.slug}">Check it out!</a></h3>
                  </div>
                `
              }).join('------------------------')}

              <br />

              <p>If you do not with to receive notifications, then turn off notifications by going to your dashboard and update profile and uncheck the categories.</p>
              <a href="${process.env.CLIENT_URL}/user/profile/update">Your Profile</a>

            </body>
          </html>`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New Cool Link You Might Be Interested In'
      }
    }
  };
};

exports.registerEmailParams = registerEmailParams;
exports.forgotPasswordEmailParams = forgotPasswordEmailParams;
exports.linkPublishedParams = linkPublishedParams;