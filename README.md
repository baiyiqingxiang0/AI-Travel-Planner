# AI旅行规划助手

这是一个现代化的AI旅行规划助手网页应用，帮助用户快速生成个性化旅行行程计划。

## 🌟 在线演示

👉 [点击这里查看在线演示](http://www.baiyiqingxiang.online:8005/)

![项目预览](assets/images/preview.png)

## 功能特点

- **智能行程规划**：根据目的地和天数自动生成详细行程
- **多模型支持**：支持DeepSeek和Moonshot两种AI模型，用户可自由切换
- **AI驱动建议**：集成先进AI API提供真实的旅行建议
- **专业提示词优化**：采用旅行规划师角色提示，生成更专业、更实用的行程
- **时间轴设计**：每日行程以时间轴形式清晰展示
- **响应式布局**：完美适配桌面端和移动端设备
- **现代UI设计**：采用符合苹果设计风格的界面元素
- **暗黑模式支持**：提供明亮和暗黑两种主题模式
- **交互动画**：表单聚焦流光效果、卡片悬停抬升效果
- **复制功能**：一键复制行程内容

## 技术栈

- HTML5 + CSS3 + JavaScript
- Tailwind CSS 框架
- Font Awesome 图标库
- Google Fonts (Inter字体族)
- Intersection Observer API (滚动动画)
- DeepSeek & Moonshot AI API (智能行程生成)

## 快速开始

### 在线使用

直接访问[在线演示](http://www.baiyiqingxiang.online:8005/)即可使用。

### 本地部署

1. 克隆仓库
```bash
git clone https://github.com/yourusername/ai-travel-planner.git
cd ai-travel-planner
```

2. 使用本地服务器运行
```bash
# 如果你有Python
python -m http.server

# 如果你有Node.js
npx serve
```

3. 在浏览器中访问 `http://localhost:8000` 或服务器提供的URL

## 使用方法

1. 选择想要使用的AI模型（DeepSeek或Moonshot）
2. 在表单中输入目的地和旅行天数
3. 点击"生成行程"按钮
4. 查看生成的详细旅行计划
5. 可以点击每个行程卡片右上角的复制按钮复制内容
6. 点击右上角的主题切换按钮可以切换明亮/暗黑模式

## 文件结构

```
/
├── index.html          # 主页面
├── css/
│   └── styles.css      # 自定义样式
├── js/
│   └── main.js         # 主要JavaScript逻辑
├── assets/
│   └── icons/          # SVG图标
│       └── favicon.svg # 网站图标
└── README.md           # 项目说明文档
```

## 设计规范

- **主色调**：#1B8CD1
- **辅助色**：#2AABEE
- **背景色**：#f8f9fa
- **字体**：Inter字体族
- **阴影效果**：多层阴影设计 (box-shadow: 0 8px 32px rgba(0,0,0,0.1))
- **交互动画**：按钮悬停缩放(transform: scale(1.02))、表单聚焦流光效果

## 实现细节

- **浮动标签表单**：使用CSS伪类和变换实现标签浮动效果
- **渐变文字**：使用CSS渐变和背景裁剪实现渐变文字效果
- **时间轴设计**：使用相对定位和伪元素创建垂直时间轴
- **骨架屏加载**：使用CSS动画模拟内容加载状态
- **交叉观察器**：使用Intersection Observer API实现滚动触发动画
- **响应式布局**：使用Tailwind的响应式类和CSS媒体查询适配不同设备
- **AI集成**：通过DeepSeek和Moonshot API生成个性化旅行建议，包含错误处理和备用方案
- **专业提示词**：采用旅行规划师角色定位，提供结构化指南和格式要求，生成高质量行程

## AI提示词优化

本项目使用了优化的AI提示词，采用"旅行规划师"角色定位，指导AI生成更专业、更实用的旅行行程：

```javascript
const prompt = `你是一位资深旅行规划师。请为用户生成一个去${destination}旅行${days}天的详细行程计划。

作为专业旅行规划师，请遵循以下指南：
1. 根据旅行目的地和天数，生成一份包含建议活动和餐饮的行程草案
2. 确保行程结构清晰、信息丰富且引人入胜
3. 提供一个细致且平衡的行程，尽可能引用真实景点和美食
4. 注重清晰度、连贯性和整体质量
5. 切勿编造不存在的景点或餐厅

每天的行程应包含以下内容：
- 上午活动（2-3个景点或体验）
- 午餐推荐（当地特色美食）
- 下午活动（2-3个景点或体验）
- 晚餐推荐（当地特色美食）
- 晚上活动（如有）

请确保行程合理，考虑到景点之间的距离和游览时间。...`;
```

## API配置

本项目支持多种AI模型生成旅行建议。API配置如下：

### DeepSeek API
```javascript
{
    name: 'DeepSeek',
    apiKey: 'YOUR_DEEPSEEK_API_KEY', // 请替换为你的API密钥
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat'
}
```

### Moonshot API
```javascript
{
    name: 'Moonshot',
    apiKey: 'YOUR_MOONSHOT_API_KEY', // 请替换为你的API密钥
    apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
    model: 'moonshot-v1-8k'
}
```

## 贡献指南

欢迎对本项目进行贡献！以下是贡献步骤：

1. Fork本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个Pull Request

## 未来改进方向

- 接入真实的AI API，生成更加个性化的旅行建议
- 添加更多目的地的特色行程模板
- 实现行程保存和分享功能
- 添加更多交通和住宿选项
- 集成地图功能，显示行程路线
- 进一步优化提示词，增加更多旅行偏好选项

## 许可证

本项目采用MIT许可证 - 查看[LICENSE](LICENSE)文件了解详情

## 开发者

本项目由AI助手开发，遵循现代Web开发最佳实践。

---

如果你喜欢这个项目，请给它一个⭐️！ 