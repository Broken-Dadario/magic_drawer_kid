// Netlify Function - 处理单词翻译请求
// 这个函数会在Netlify的服务器上运行，避免在客户端暴露API密钥

exports.handler = async (event, context) => {
  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: '只允许POST请求' })
    };
  }

  try {
    // 从环境变量中获取API密钥（需要在Netlify后台配置）
    const apiKey = process.env.CONST_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: '服务器配置错误：未找到API密钥' })
      };
    }

    // 解析请求体
    const { word } = JSON.parse(event.body);

    if (!word) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '缺少单词参数' })
      };
    }

    // 调用Google Gemini API进行翻译
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helper for a children's English learning app.
Task: Translate the English word "${word}" to Simplified Chinese and provide Pinyin.
Output strictly in this JSON format: {"translation": "ChineseWord", "pinyin": "Pinyin"}.
Do not add markdown or any other formatting.`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API错误:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: 'AI翻译服务调用失败',
          details: errorText
        })
      };
    }

    const result = await response.json();
    const jsonText = result.candidates[0].content.parts[0].text;
    const translationData = JSON.parse(jsonText);

    // 返回翻译结果
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        translation: translationData.translation,
        pinyin: translationData.pinyin
      })
    };

  } catch (error) {
    console.error('函数执行错误:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: '服务器内部错误',
        message: error.message
      })
    };
  }
};
