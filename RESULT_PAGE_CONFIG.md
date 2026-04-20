# Result Page Configuration Guide

## 文件结构

Result页面的配置文件：
- `src/data/resultData.json` - 储存所有10个知识点的配置数据
- `result_data.csv` - Excel格式的数据表，方便编辑

## 文件说明

### resultData.json 结构
```json
{
  "results": [
    {
      "id": 1,
      "titles": {
        "Creative": "Your work is creative!",
        "Beautiful": "Your work is beautiful!",
        "Professional": "Your work is professional!",
        "Genius": "Your work is genius!"
      },
      "description": "描述文本...",
      "iconPath": "icons/icon-1.svg",
      "imagePath": "3.jpeg",
      "qrcodePath": "2.jpeg"
    },
    ...
  ]
}
```

## 编辑方式

### 使用CSV编辑
1. 打开 `result_data.csv` 文件，用Excel或Google Sheets编辑
2. 编辑完成后保存

### 使用JSON编辑
1. 打开 `src/data/resultData.json` 文件直接编辑
2. 编辑完成后保存

## 字段说明

| 字段 | 说明 | 例子 |
|------|------|------|
| id | 知识点ID | 1-10 |
| titles | 针对不同类型的标题 | Creative/Beautiful/Professional/Genius |
| description | 知识点的说明文本 | "An octopus has..." |
| iconPath | 上排图标路径 | icons/icon-1.svg |
| imagePath | 下方大图片路径 | 3.jpeg |
| qrcodePath | 右下角二维码路径 | 2.jpeg |

## 文件替换

### 替换背景图片
- 修改: `public/1.jpeg` (纯背景)

### 替换图标
- 路径: `public/icons/icon-[1-10].(svg/png)`
- 在 `resultData.json` 中修改 `iconPath` 字段

### 替换内容图片
- 路径: `public/result-images/`
- 在 `resultData.json` 中修改 `imagePath` 字段

### 替换二维码
- 路径: `public/qrcodes/`
- 在 `resultData.json` 中修改 `qrcodePath` 字段

## 示例

对于知识点1，当用户选择"Creative"时，会显示：
- 标题: "Your work is creative!"
- 图标: `public/icons/icon-1.svg`
- 说明: 章鱼的知识
- 大图: `public/3.jpeg`
- 二维码: `public/2.jpeg`

当用户选择"Beautiful"时，标题会变成"Your work is beautiful!"，其他内容保持不变。

## 如何同步更新

如果你用CSV编辑，完成后需要手动同步到JSON文件，或告诉我更新。
如果直接编辑JSON，会立即生效。

## 添加新知识点

如果需要添加超过10个知识点，需要：
1. 在 `resultData.json` 中添加新的对象
2. 创建相应的图标文件到 `public/icons/`
3. 创建相应的图片文件到 `public/result-images/`
4. 创建相应的二维码文件到 `public/qrcodes/`
