import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API anahtarı bulunamadı. Flashcard oluşturma çalışmayacak.');
}

export interface FlashcardContent {
  content: string;
  explanation?: string;
}

function extractJsonFromMarkdown(content: string): string {
  // Markdown kod bloğu sarmalayıcısını kaldır
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  // Markdown sarmalayıcısı yoksa, içeriği olduğu gibi döndür
  return content.trim();
}

export async function generateFlashcards(
  grade: number,
  subject: string,
  topic: string,
  count: number = 10
): Promise<FlashcardContent[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API anahtarı yapılandırılmamış');
  }

  const prompt = `${grade}. sınıf öğrencisi için ${subject} dersinden "${topic}" konusu hakkında ${count} adet eğitici flashcard oluştur.

Her flashcard için şunları sağla:
1. Kavramın anlaşılmasını test eden açık, kısa bir soru veya ifade
2. İçeriğin ${grade}. sınıf seviyesine uygun olduğundan emin ol
3. "${topic}" konusuyla ilgili temel kavramlar, tanımlar veya önemli gerçeklere odaklan

Yanıtını şu yapıda bir JSON dizisi olarak formatla:
[
  {
    "content": "... nedir?"
  },
  {
    "content": "... nasıl açıklanır?"
  }
]

Her flashcard'ın eğitici, ilgi çekici ve sınıf seviyesine uygun olduğundan emin ol.`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    
    try {
      const jsonContent = extractJsonFromMarkdown(content);
      const flashcards = JSON.parse(jsonContent);
      return flashcards.map((card: any, index: number) => ({
        content: card.content,
        explanation: card.explanation || null,
      }));
    } catch (parseError) {
      console.error('OpenAI yanıtı ayrıştırılamadı:', parseError);
      console.error('Ham içerik:', content);
      throw new Error('OpenAI\'dan geçersiz yanıt formatı');
    }
  } catch (error) {
    console.error('OpenAI API hatası:', error);
    throw new Error('Flashcard\'lar oluşturulamadı');
  }
}

export async function generateExplanatoryFlashcards(
  grade: number,
  subject: string,
  topic: string,
  difficultCards: string[]
): Promise<FlashcardContent[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API anahtarı yapılandırılmamış');
  }

  const prompt = `${grade}. sınıf öğrencisi "${topic}" konusundan ${subject} dersinde bu kavramları anlamakta zorlanıyor:

${difficultCards.map((card, index) => `${index + 1}. ${card}`).join('\n')}

Şunları yapan açıklayıcı flashcard'lar oluştur:
1. Her zor kavramı daha basit terimlerle açıkla
2. ${grade}. sınıf için uygun örnekler kullan
3. Adım adım açıklamalar sağla
4. Yardımcı olduğunda analojiler veya gerçek dünya bağlantıları kullan

Yanıtını şu yapıda bir JSON dizisi olarak formatla:
[
  {
    "content": "Bu kavramı daha basit terimlerle açıklayayım...",
    "explanation": "Ek yardımcı detaylar veya örnekler"
  }
]

Açıklamaların açık, cesaret verici ve güven artırıcı olduğundan emin ol.`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    
    try {
      const jsonContent = extractJsonFromMarkdown(content);
      const flashcards = JSON.parse(jsonContent);
      return flashcards.map((card: any) => ({
        content: card.content,
        explanation: card.explanation || null,
      }));
    } catch (parseError) {
      console.error('OpenAI yanıtı ayrıştırılamadı:', parseError);
      console.error('Ham içerik:', content);
      throw new Error('OpenAI\'dan geçersiz yanıt formatı');
    }
  } catch (error) {
    console.error('OpenAI API hatası:', error);
    throw new Error('Açıklayıcı flashcard\'lar oluşturulamadı');
  }
}