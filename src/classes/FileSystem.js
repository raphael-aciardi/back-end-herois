const fs = require('fs');

class FileSystem {
  readFile = (path, base64 = false) => {
    try {
      if (base64) {
        return fs.readFileSync(path).toString('base64');
      } else {
        return fs.readFileSync(path);
      }
    } catch (error) {
      console.log('Error getting file: ', error);
    }
  };

  getDirFiles = dirname => {
    return new Promise((resolve, reject) => {
      fs.readdir(dirname, function (err, filenames) {
        if (err) {
          reject(err);
        }
        resolve(filenames);
      });
    });
  };

  async saveImage(image, path, encoding, res) {
    try {
      let work = true;
      let writeStream = fs.createWriteStream(path);

      writeStream.write(image, encoding);

      writeStream.on('finish', () => {
        work = true;
      });

      writeStream.end();
      return work;
    } catch (error) {
      console.log('Error writing file: ', error);
      res.status(500).json(error);
    }
  }

  genNameFile(prefix, extension) {
    try {
      let name = prefix + Math.floor(Math.random() * 101);
      name +=
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      name += extension;
      return name;
    } catch (error) {
      console.log('Error generating file name: ', error);
    }
  }
}

export default new FileSystem();
