// DOM元素
const travelForm = document.getElementById('travel-form');
const destinationInput = document.getElementById('destination');
const daysInput = document.getElementById('days');
const generateBtn = document.getElementById('generate-btn');
const inputSection = document.getElementById('input-section');
const loadingSection = document.getElementById('loading-section');
const resultSection = document.getElementById('result-section');
const itineraryContainer = document.getElementById('itinerary-container');
const destinationDisplay = document.getElementById('destination-display');
const daysDisplay = document.getElementById('days-display');
const newPlanBtn = document.getElementById('new-plan-btn');
const themeToggle = document.getElementById('theme-toggle');
const errorNotification = document.getElementById('error-notification');
const errorMessage = document.getElementById('error-message');

// AI模型配置
const AI_MODELS = {
    deepseek: {
        name: 'DeepSeek',
        apiKey: 'YOUR_DEEPSEEK_API_KEY', // 请替换为你的API密钥
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat'
    },
    moonshot: {
        name: 'Moonshot',
        apiKey: 'YOUR_MOONSHOT_API_KEY', // 请替换为你的API密钥
        apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
        model: 'moonshot-v1-8k'
    }
};

// 当前选择的模型
let currentModel = 'deepseek';

// 页面加载时检查主题偏好和模型选择
document.addEventListener('DOMContentLoaded', () => {
    // 检查本地存储中的主题设置
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // 检查本地存储中的模型设置
    if (localStorage.getItem('aiModel')) {
        currentModel = localStorage.getItem('aiModel');
    }
    
    // 设置表单验证
    setupFormValidation();
    
    // 设置交叉观察器用于滚动动画
    setupIntersectionObserver();
    
    // 添加模型选择器到表单
    addModelSelector();
    
    // 初始更新模型选择UI
    setTimeout(() => {
        updateModelSelection();
    }, 100);
});

// 主题切换
themeToggle.addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
});

// 表单提交处理
travelForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // 获取表单数据
    const destination = destinationInput.value.trim();
    const days = parseInt(daysInput.value);
    
    // 验证表单
    if (!destination) {
        showError('请输入目的地');
        return;
    }
    
    if (isNaN(days) || days < 1 || days > 30) {
        showError('请输入1-30之间的旅行天数');
        return;
    }
    
    // 显示加载状态
    inputSection.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        inputSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');
        
        // 模拟API请求延迟
        setTimeout(() => {
            generateItinerary(destination, days);
        }, 2000);
    }, 300);
});

// 新行程按钮
newPlanBtn.addEventListener('click', () => {
    // 重置表单
    travelForm.reset();
    
    // 隐藏结果区，显示输入区
    resultSection.classList.add('opacity-0');
    setTimeout(() => {
        resultSection.classList.add('hidden');
        resultSection.classList.remove('opacity-0');
        inputSection.classList.remove('hidden', 'scale-95', 'opacity-0');
    }, 300);
});

// 显示错误提示
function showError(message) {
    errorMessage.textContent = message;
    errorNotification.classList.remove('hidden');
    errorNotification.classList.add('show');
    
    // 3秒后自动隐藏
    setTimeout(() => {
        errorNotification.classList.remove('show');
        setTimeout(() => {
            errorNotification.classList.add('hidden');
        }, 300);
    }, 3000);
}

// 设置表单验证
function setupFormValidation() {
    // 实时验证
    destinationInput.addEventListener('input', () => {
        if (destinationInput.validity.valueMissing) {
            destinationInput.classList.add('border-red-500');
        } else {
            destinationInput.classList.remove('border-red-500');
        }
    });
    
    daysInput.addEventListener('input', () => {
        const days = parseInt(daysInput.value);
        if (isNaN(days) || days < 1 || days > 30) {
            daysInput.classList.add('border-red-500');
        } else {
            daysInput.classList.remove('border-red-500');
        }
    });
}

// 设置交叉观察器用于滚动动画
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // 观察所有带有fade-in类的元素
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// 生成行程
function generateItinerary(destination, days) {
    // 更新显示信息
    destinationDisplay.textContent = destination;
    daysDisplay.textContent = days;
    
    // 清空之前的行程
    itineraryContainer.innerHTML = '';
    
    // 调用AI API获取行程建议
    fetchDeepSeekItinerary(destination, days)
        .then(itineraryData => {
            // 生成行程卡片
            for (let day = 1; day <= days; day++) {
                const card = createItineraryCard(day, destination, itineraryData[day - 1]);
                itineraryContainer.appendChild(card);
            }
            
            // 隐藏加载状态，显示结果
            loadingSection.classList.add('opacity-0');
            setTimeout(() => {
                loadingSection.classList.add('hidden');
                loadingSection.classList.remove('opacity-0');
                resultSection.classList.remove('hidden');
                
                // 添加渐入动画类
                document.querySelectorAll('.itinerary-card').forEach((card, index) => {
                    card.classList.add('fade-in');
                    // 错开动画时间
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, 100 * index);
                });
            }, 300);
        })
        .catch(error => {
            console.error('获取行程失败:', error);
            showError('生成行程失败，请重试');
            
            // 隐藏加载状态，显示输入区
            loadingSection.classList.add('opacity-0');
            setTimeout(() => {
                loadingSection.classList.add('hidden');
                loadingSection.classList.remove('opacity-0');
                inputSection.classList.remove('hidden', 'scale-95', 'opacity-0');
            }, 300);
        });
}

// 添加模型选择器
function addModelSelector() {
    // 创建模型选择器容器
    const modelSelectorContainer = document.createElement('div');
    modelSelectorContainer.className = 'flex justify-center items-center space-x-4 mb-4';
    modelSelectorContainer.id = 'model-selector';
    
    // 创建DeepSeek选项
    const deepseekOption = document.createElement('button');
    deepseekOption.type = 'button';
    deepseekOption.className = `px-4 py-2 rounded-lg border transition-colors ${currentModel === 'deepseek' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`;
    deepseekOption.textContent = 'DeepSeek';
    deepseekOption.onclick = () => switchModel('deepseek');
    
    // 创建Moonshot选项
    const moonshotOption = document.createElement('button');
    moonshotOption.type = 'button';
    moonshotOption.className = `px-4 py-2 rounded-lg border transition-colors ${currentModel === 'moonshot' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`;
    moonshotOption.textContent = 'Moonshot';
    moonshotOption.onclick = () => switchModel('moonshot');
    
    // 添加选项到容器
    modelSelectorContainer.appendChild(deepseekOption);
    modelSelectorContainer.appendChild(moonshotOption);
    
    // 将容器添加到表单前
    const form = document.getElementById('travel-form');
    
    // 检查是否已存在模型选择器，避免重复添加
    const existingSelector = document.getElementById('model-selector');
    if (existingSelector) {
        existingSelector.remove();
    }
    
    form.parentNode.insertBefore(modelSelectorContainer, form);
}

// 切换AI模型
function switchModel(modelKey) {
    currentModel = modelKey;
    localStorage.setItem('aiModel', modelKey);
    updateModelSelection();
}

// 更新模型选择UI
function updateModelSelection() {
    const buttons = document.querySelectorAll('#model-selector button');
    buttons.forEach(button => {
        const modelName = button.textContent.toLowerCase();
        const modelKey = modelName === 'deepseek' ? 'deepseek' : 'moonshot';
        
        if (modelKey === currentModel) {
            button.classList.add('bg-primary', 'text-white', 'border-primary');
            button.classList.remove('bg-white', 'dark:bg-gray-800', 'border-gray-300', 'dark:border-gray-700', 'text-gray-700', 'dark:text-gray-300');
        } else {
            button.classList.remove('bg-primary', 'text-white', 'border-primary');
            button.classList.add('bg-white', 'dark:bg-gray-800', 'border-gray-300', 'dark:border-gray-700', 'text-gray-700', 'dark:text-gray-300');
        }
    });
}

// 调用AI API获取行程建议
async function fetchDeepSeekItinerary(destination, days) {
    try {
        // 获取当前选择的模型配置
        const modelConfig = AI_MODELS[currentModel];
        
        if (!modelConfig) {
            console.error('未找到模型配置:', currentModel);
            throw new Error('模型配置错误');
        }
        
        // 构建提示词
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

请确保行程合理，考虑到景点之间的距离和游览时间。每天的行程应该是一个JSON对象，包含时间和活动描述。整个行程应该是一个JSON数组。

请按照以下格式返回JSON数据：
\`\`\`json
[
  [
    {"time": "08:00", "description": "早餐"},
    {"time": "09:30", "description": "参观XX景点"},
    {"time": "12:00", "description": "午餐: XX特色餐厅"},
    {"time": "14:00", "description": "游览XX地区"},
    {"time": "18:00", "description": "晚餐: XX美食"},
    {"time": "20:00", "description": "XX夜景/演出"}
  ],
  // 第二天及后续日程...
]
\`\`\`

记住：行程的质量非常重要，请提供专业、实用且令人期待的旅行计划。`;

        console.log('使用模型:', modelConfig.name);
        console.log('API URL:', modelConfig.apiUrl);
        
        // 尝试调用API
        try {
            const response = await fetch(modelConfig.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${modelConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: modelConfig.model,
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                console.error('API响应错误:', response.status, response.statusText);
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            console.log('API响应:', data);
            
            // 解析API返回的内容
            try {
                // 尝试从返回内容中提取JSON
                const content = data.choices[0].message.content;
                console.log('API返回内容:', content);
                
                const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                                content.match(/```\n([\s\S]*?)\n```/) || 
                                content.match(/\[([\s\S]*?)\]/);
                
                let itineraryData;
                if (jsonMatch) {
                    const parsedData = JSON.parse(jsonMatch[1]);
                    
                    // 检查是否是Moonshot格式的数据（包含day, morning, afternoon等字段）
                    if (parsedData.length > 0 && parsedData[0].hasOwnProperty('day')) {
                        console.log('检测到Moonshot格式数据，进行转换');
                        itineraryData = convertMoonshotFormat(parsedData);
                    } else {
                        itineraryData = parsedData;
                    }
                } else {
                    // 如果无法提取JSON，则解析文本内容生成行程
                    itineraryData = parseTextToItinerary(content, days);
                }
                
                return itineraryData;
            } catch (parseError) {
                console.error('解析API返回内容失败:', parseError);
                // 返回备用行程数据
                return generateFallbackItinerary(destination, days);
            }
        } catch (fetchError) {
            console.error('API请求失败:', fetchError);
            // 返回备用行程数据
            return generateFallbackItinerary(destination, days);
        }
    } catch (error) {
        console.error('获取行程失败:', error);
        // 返回备用行程数据
        return generateFallbackItinerary(destination, days);
    }
}

// 转换Moonshot格式的数据为我们需要的格式
function convertMoonshotFormat(moonshotData) {
    const convertedData = [];
    
    moonshotData.forEach(dayData => {
        const dayActivities = [];
        
        // 处理上午活动
        if (dayData.morning && Array.isArray(dayData.morning)) {
            dayData.morning.forEach(item => {
                if (item.time && (item.activity || item.description)) {
                    dayActivities.push({
                        time: item.time,
                        description: item.activity || item.description
                    });
                }
            });
        }
        
        // 处理午餐
        if (dayData.lunch) {
            dayActivities.push({
                time: dayData.lunch.time || '12:30',
                description: `午餐: ${dayData.lunch.recommendation || dayData.lunch.description || '当地特色美食'}`
            });
        }
        
        // 处理下午活动
        if (dayData.afternoon && Array.isArray(dayData.afternoon)) {
            dayData.afternoon.forEach(item => {
                if (item.time && (item.activity || item.description)) {
                    dayActivities.push({
                        time: item.time,
                        description: item.activity || item.description
                    });
                }
            });
        }
        
        // 处理晚餐
        if (dayData.dinner) {
            dayActivities.push({
                time: dayData.dinner.time || '18:30',
                description: `晚餐: ${dayData.dinner.recommendation || dayData.dinner.description || '当地特色美食'}`
            });
        }
        
        // 处理晚上活动
        if (dayData.evening) {
            dayActivities.push({
                time: dayData.evening.time || '20:00',
                description: dayData.evening.activity || dayData.evening.description || '晚间休闲活动'
            });
        }
        
        // 如果没有提取到活动，添加默认活动
        if (dayActivities.length === 0) {
            dayActivities.push(
                { time: '08:00', description: '早餐' },
                { time: '10:00', description: '上午景点游览' },
                { time: '12:30', description: '午餐' },
                { time: '14:00', description: '下午景点游览' },
                { time: '18:00', description: '晚餐' }
            );
        }
        
        // 按时间排序
        dayActivities.sort((a, b) => {
            const timeA = a.time.split(':').map(Number);
            const timeB = b.time.split(':').map(Number);
            return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
        });
        
        convertedData.push(dayActivities);
    });
    
    return convertedData;
}

// 解析文本内容生成行程
function parseTextToItinerary(content, days) {
    const itineraryData = [];
    
    // 简单的文本解析逻辑
    const dayRegex = /第(\d+)天|Day (\d+)/gi;
    const timeRegex = /(\d{1,2}:\d{2})/g;
    
    let dayMatches = [...content.matchAll(dayRegex)];
    
    for (let i = 0; i < days; i++) {
        const activities = [];
        
        if (dayMatches.length > i) {
            const currentDayIndex = dayMatches[i].index;
            const nextDayIndex = (i < dayMatches.length - 1) ? dayMatches[i + 1].index : content.length;
            const dayContent = content.substring(currentDayIndex, nextDayIndex);
            
            // 提取时间和活动
            const timeMatches = [...dayContent.matchAll(timeRegex)];
            
            timeMatches.forEach((match, index) => {
                const time = match[0];
                const startIndex = match.index + match[0].length;
                const endIndex = (index < timeMatches.length - 1) ? timeMatches[index + 1].index : dayContent.length;
                const description = dayContent.substring(startIndex, endIndex).trim()
                    .replace(/[：:]/g, '')
                    .replace(/^\s*-\s*/, '')
                    .trim();
                
                if (description) {
                    activities.push({ time, description });
                }
            });
        }
        
        // 如果没有提取到活动，添加默认活动
        if (activities.length === 0) {
            activities.push(
                { time: '08:00', description: '早餐' },
                { time: '10:00', description: '上午景点游览' },
                { time: '12:30', description: '午餐' },
                { time: '14:00', description: '下午景点游览' },
                { time: '18:00', description: '晚餐' }
            );
        }
        
        itineraryData.push(activities);
    }
    
    return itineraryData;
}

// 生成备用行程数据
function generateFallbackItinerary(destination, days) {
    const itineraryData = [];
    
    for (let day = 1; day <= days; day++) {
        const activities = generateActivities(day, destination);
        itineraryData.push(activities);
    }
    
    return itineraryData;
}

// 创建行程卡片
function createItineraryCard(day, destination, activities = null) {
    // 创建卡片元素
    const card = document.createElement('div');
    card.className = 'itinerary-card bg-white dark:bg-dark-card rounded-lg shadow-md p-5 transition-all duration-300';
    
    // 卡片标题
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';
    
    const title = document.createElement('h3');
    title.className = 'text-lg font-semibold text-gray-800 dark:text-gray-200';
    title.textContent = `第${day}天`;
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.setAttribute('aria-label', '复制行程');
    copyBtn.onclick = function() {
        copyItinerary(this, card);
    };
    
    header.appendChild(title);
    header.appendChild(copyBtn);
    
    // 时间轴内容
    const timeline = document.createElement('div');
    timeline.className = 'timeline mt-4';
    
    // 使用API返回的活动或生成备用活动
    const dayActivities = activities || generateActivities(day, destination);
    
    dayActivities.forEach(activity => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        const timelineDot = document.createElement('div');
        timelineDot.className = 'timeline-dot';
        
        const timelineContent = document.createElement('div');
        timelineContent.className = 'ml-2';
        
        const timeText = document.createElement('p');
        timeText.className = 'text-sm font-medium text-primary dark:text-secondary';
        timeText.textContent = activity.time;
        
        const activityText = document.createElement('p');
        activityText.className = 'text-gray-700 dark:text-gray-300';
        activityText.textContent = activity.description;
        
        timelineContent.appendChild(timeText);
        timelineContent.appendChild(activityText);
        
        timelineItem.appendChild(timelineDot);
        timelineItem.appendChild(timelineContent);
        
        timeline.appendChild(timelineItem);
    });
    
    // 组装卡片
    card.appendChild(header);
    card.appendChild(timeline);
    
    return card;
}

// 复制行程内容
function copyItinerary(button, card) {
    // 获取卡片中的文本内容
    const textContent = card.innerText;
    
    // 复制到剪贴板
    navigator.clipboard.writeText(textContent)
        .then(() => {
            // 显示复制成功状态
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.classList.add('copied');
            
            // 3秒后恢复原状
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i>';
                button.classList.remove('copied');
            }, 3000);
        })
        .catch(err => {
            console.error('复制失败:', err);
            showError('复制失败，请重试');
        });
}

// 根据目的地和天数生成行程活动
function generateActivities(day, destination) {
    // 常见的旅游活动时间段
    const timeSlots = ['08:00', '10:00', '12:30', '14:00', '16:30', '19:00', '21:00'];
    
    // 根据目的地生成不同的活动
    let activities = [];
    
    // 模拟不同目的地的行程
    if (destination.includes('北京')) {
        const beijingActivities = [
            '参观故宫博物院，感受中国古代宫廷文化',
            '游览天安门广场，观看升旗仪式',
            '在王府井大街享用北京特色小吃',
            '攀登八达岭长城，俯瞰壮丽景色',
            '漫步颐和园，欣赏皇家园林之美',
            '品尝正宗北京烤鸭',
            '欣赏精彩的京剧表演',
            '探访798艺术区，感受现代艺术氛围',
            '在南锣鼓巷体验老北京胡同文化',
            '参观奥林匹克公园，观赏鸟巢和水立方'
        ];
        
        // 根据天数选择不同的活动
        for (let i = 0; i < Math.min(timeSlots.length, 5); i++) {
            activities.push({
                time: timeSlots[i],
                description: beijingActivities[(day - 1 + i) % beijingActivities.length]
            });
        }
    } else if (destination.includes('上海')) {
        const shanghaiActivities = [
            '漫步外滩，欣赏黄浦江两岸风光',
            '游览豫园，体验江南园林之美',
            '登上东方明珠电视塔，俯瞰上海全景',
            '探访上海迪士尼乐园，体验奇妙旅程',
            '在南京路步行街购物体验',
            '品尝正宗上海本帮菜',
            '参观上海博物馆，了解中国艺术历史',
            '游览田子坊，感受上海文艺氛围',
            '乘坐黄浦江游船，欣赏夜景',
            '探访世博会遗址公园'
        ];
        
        for (let i = 0; i < Math.min(timeSlots.length, 5); i++) {
            activities.push({
                time: timeSlots[i],
                description: shanghaiActivities[(day - 1 + i) % shanghaiActivities.length]
            });
        }
    } else {
        // 通用行程
        const genericActivities = [
            `探索${destination}的著名景点`,
            `品尝${destination}的当地美食`,
            `参观${destination}的历史博物馆`,
            `在${destination}的公园散步放松`,
            `体验${destination}的特色文化活动`,
            `购买${destination}的特色纪念品`,
            `参加${destination}的导览观光团`,
            `在${destination}的咖啡馆休息`,
            `欣赏${destination}的自然风光`,
            `体验${destination}的夜生活`
        ];
        
        for (let i = 0; i < Math.min(timeSlots.length, 5); i++) {
            activities.push({
                time: timeSlots[i],
                description: genericActivities[(day - 1 + i) % genericActivities.length]
            });
        }
    }
    
    return activities;
} 