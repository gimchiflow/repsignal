import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewText, rating, platform, businessName } = body

    if (!reviewText || !rating || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields: reviewText, rating, platform' },
        { status: 400 }
      )
    }

    const sentimentHint =
      rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'negative'

    const prompt = `You are a professional customer service representative for ${businessName ?? 'a local business'}.

A customer left the following ${rating}-star review on ${platform}:

"${reviewText}"

Write a professional, warm, and genuine 2-3 sentence response to this ${sentimentHint} review.

Guidelines:
- Thank the reviewer by name if possible, otherwise use a friendly greeting
- For positive reviews: express genuine gratitude and invite them back
- For negative reviews: acknowledge their concern sincerely, apologize, and offer to make it right (include a generic contact prompt like "please reach out to us directly")
- For neutral reviews: thank them and highlight a commitment to improvement
- Keep it concise (2-3 sentences max), professional, and human-sounding
- Do NOT use generic filler phrases like "We value your feedback"
- Do NOT include a signature line or business name at the end
- Return ONLY the response text, no preamble or explanation`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const textBlock = message.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No text response from AI' }, { status: 500 })
    }

    return NextResponse.json({ draft: textBlock.text.trim() })
  } catch (error: unknown) {
    console.error('[ai-response] Error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
