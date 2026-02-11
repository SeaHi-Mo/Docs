import type MarkdownIt from 'markdown-it'

export function stepsContainer(md: MarkdownIt) {
  const defaultFence = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const info = token.info.trim()

    if (info === 'steps') {
      try {
        const content = token.content.trim()
        const lines = content.split('\n')

        const steps: Array<{
          icon?: string
          title?: string
          text: string
          image?: string
          alt?: string
        }> = []

        let currentStep: any = {}

        for (const line of lines) {
          const trimmedLine = line.trim()

          if (trimmedLine.startsWith('- icon:')) {
            if (Object.keys(currentStep).length > 0) {
              steps.push(currentStep)
            }
            currentStep = { icon: trimmedLine.replace(/^- icon:/, '').trim().replace(/^['"]|['"]$/g, '') }
          } else if (trimmedLine.startsWith('title:')) {
            currentStep.title = trimmedLine.replace(/^title:/, '').trim().replace(/^['"]|['"]$/g, '')
          } else if (trimmedLine.startsWith('text:')) {
            currentStep.text = trimmedLine.replace(/^text:/, '').trim().replace(/^['"]|['"]$/g, '')
          } else if (trimmedLine.startsWith('image:')) {
            const imagePath = trimmedLine.replace(/^image:/, '').trim().replace(/^['"]|['"]$/g, '')
            currentStep.image = imagePath
          } else if (trimmedLine.startsWith('alt:')) {
            currentStep.alt = trimmedLine.replace(/^alt:/, '').trim().replace(/^['"]|['"]$/g, '')
          }
        }

        if (Object.keys(currentStep).length > 0) {
          steps.push(currentStep)
        }

        const stepsJson = JSON.stringify(steps).replace(/"/g, '&quot;')

        return `<StepList :steps="${stepsJson}" />`
      } catch (error) {
        console.error('Error parsing steps:', error)
        return `<div class="error">解析步骤失败: ${error}</div>`
      }
    }

    return defaultFence(tokens, idx, options, env, self)
  }
}
