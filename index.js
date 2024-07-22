import fs from 'fs';
import sharp from 'sharp';

// 读取当前目录中的 /assets 目录下所有文件，找到全部的图片文件
// 会有多级目录，需要全部找出来
const readDir = (path) => {
  const files = fs.readdirSync(path);
  let fileList = [];
  files.forEach((item) => {
	const fPath = `${path}/${item}`;
	const stats = fs.statSync(fPath);
	if (stats.isDirectory()) {
	  fileList = fileList.concat(readDir(fPath));
	}
	if (stats.isFile()) {
	  fileList.push(fPath);
	}
  });
  return fileList;
};

// 读取所有图片文件
const files = readDir('./assets').filter((file) => {
  return /\.(png|jpe?g|gif|webp)$/.test(file);
});

// 压缩图片并转换为webp格式
files.forEach((file) => {
  sharp(file)
    .resize({ width: 2000, withoutEnlargement: true })
    .toFormat('webp')
    .toBuffer()
    .then((data) => {
      // 将压缩后的图片输出到 output 目录
      const outputPath = file.replace('assets', 'output').replace(/\.(png|jpe?g|gif|webp)$/, '.webp');
      // Create the output directory if it doesn't exist
      const outputDir = outputPath.substring(0, outputPath.lastIndexOf('/'));
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Write the file
      fs.writeFileSync(outputPath, data);
    })
    .catch((err) => console.error(err));
});
