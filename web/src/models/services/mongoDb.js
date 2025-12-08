// src/config/mongodb.js - VERSION FINALE
const mongodbConfig = {
  uri: "mongodb+srv://eduplatform_user:22042471amouna@eduplatform-cluster.asqnndj.mongodb.net/eduplatform?retryWrites=true&w=majority&appName=eduplatform-cluster",
  database: "eduplatform",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
};

export default mongodbConfig;