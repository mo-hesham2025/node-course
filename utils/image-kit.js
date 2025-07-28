const ImageKit = require("imagekit");
const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KET_URL_RND_POINT,
});

module.exports={
    imagekit
}
