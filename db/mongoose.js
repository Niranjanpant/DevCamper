const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(
      `Connected to database ${mongoose.connection.host}`.cyan.underline.bold
    );
  })
  .catch((e) => {
    console.log(e);
  });
