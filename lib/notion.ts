import { Client } from '@notionhq/client'
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const DATABASE_ID = '31e24394-14f6-819f-afad-ce249646aad6'

export interface NotionSection {
  id: string
  section: string
  content: string
  subtitle: string
  order: number
  published: boolean
}

function extractRichText(richText: RichTextItemResponse[]): string {
  return richText.map((t) => t.plain_text).join('')
}

export async function getPageSections(): Promise<NotionSection[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Order',
          direction: 'ascending',
        },
      ],
    })

    return response.results
      .filter(
        (page): page is PageObjectResponse => page.object === 'page' && 'properties' in page
      )
      .map((page) => {
        const props = page.properties

        const sectionProp = props['Section']
        const section =
          sectionProp?.type === 'title' ? extractRichText(sectionProp.title) : ''

        const contentProp = props['Content']
        const content =
          contentProp?.type === 'rich_text' ? extractRichText(contentProp.rich_text) : ''

        const subtitleProp = props['Subtitle']
        const subtitle =
          subtitleProp?.type === 'rich_text' ? extractRichText(subtitleProp.rich_text) : ''

        const orderProp = props['Order']
        const order = orderProp?.type === 'number' ? (orderProp.number ?? 0) : 0

        const publishedProp = props['Published']
        const published =
          publishedProp?.type === 'checkbox' ? publishedProp.checkbox : false

        return { id: page.id, section, content, subtitle, order, published }
      })
  } catch (error) {
    console.error('Error fetching Notion database:', error)
    return []
  }
}

export function getSectionByName(
  sections: NotionSection[],
  name: string
): NotionSection | undefined {
  return sections.find((s) => s.section.toLowerCase() === name.toLowerCase())
}

export function getSectionsByPrefix(
  sections: NotionSection[],
  prefix: string
): NotionSection[] {
  return sections
    .filter((s) => s.section.toLowerCase().startsWith(prefix.toLowerCase()))
    .sort((a, b) => a.order - b.order)
}
