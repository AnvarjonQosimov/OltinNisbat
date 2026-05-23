const Informations = require("../models/informations.model.js");
const fileService = require("./file.service");

class PostService {
  async getPosts() {
    const posts = await Informations.find();
    return posts;
  }

 async createPost(post, files) {
  console.log(post)
  
  let mediaArray = [];

  if (files?.media) {
    const mediaFiles = Array.isArray(files.media)
      ? files.media
      : [files.media];

    mediaFiles.forEach((file) => {
      const savedName = fileService.save(file);
      mediaArray.push(savedName);
    });
  }

  const newPost = await Informations.create({
    ownerId: post.ownerId,

    media: mediaArray,

    initInformation: post.initInformation,

    additInformation: post.additInformation,

    floor: Number(post.floor),

    totalarea: Number(post.totalarea),

    livingarea: Number(post.livingarea),

    rooms: Number(post.rooms),

    views: 0,
  });

  return newPost;
}

  async delete(id) {
    const post = await Informations.findByIdAndDelete(id);
    return post;
  }

  async edit(post, id) {
    if (!id) {
      throw new Error("Id not Found");
    }

    const updatedPost = {
      ...post,
      floor: post.floor ? Number(post.floor) : post.floor,
      totalarea: post.totalarea ? Number(post.totalarea) : post.totalarea,
      livingarea: post.livingarea ? Number(post.livingarea) : post.livingarea,
      rooms: post.rooms ? Number(post.rooms) : post.rooms,
    };

    const updatedData = await Informations.findByIdAndUpdate(id, updatedPost, {
      new: true,
    });
    return updatedData;
  }

  async getOne(id) {
    const post = await Informations.findById(id);
    return post;
  }
}

module.exports = new PostService();