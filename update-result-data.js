#!/usr/bin/env node

/**
 * 从 result_data.csv 更新 src/data/resultData.json
 * 
 * 使用方法:
 * node update-result-data.js
 * 
 * 注意: CSV文件中的每一行对应一个知识点
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

const csvPath = path.join(__dirname, 'result_data.csv');
const jsonPath = path.join(__dirname, 'src', 'data', 'resultData.json');

try {
  // 读取CSV文件
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records = csv.parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  // 转换为JSON格式
  const resultData = {
    results: records.map(row => ({
      id: parseInt(row.ID),
      titles: {
        Creative: row.Creative_Title,
        Beautiful: row.Beautiful_Title,
        Professional: row.Professional_Title,
        Genius: row.Genius_Title
      },
      description: row.Description,
      iconPath: row.Icon_Path,
      imagePath: row.Image_Path,
      qrcodePath: row.QRCode_Path
    }))
  };

  // 写入JSON文件
  fs.writeFileSync(jsonPath, JSON.stringify(resultData, null, 2), 'utf-8');
  console.log('✓ 成功更新 resultData.json');
  console.log(`✓ 共更新 ${records.length} 个知识点`);
} catch (error) {
  console.error('✗ 更新失败:', error.message);
  process.exit(1);
}
