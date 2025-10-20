import { afterEach, describe, expect, it } from 'vitest'
import { injectStructuredData, getStructuredDataScripts, structuredDataSchemas } from '../structuredData'

afterEach(() => {
  document.head.innerHTML = ''
})

describe('structuredData', () => {
  it('returns JSON-LD scripts for all schemas', () => {
    const scripts = getStructuredDataScripts()

    expect(scripts).toHaveLength(Object.keys(structuredDataSchemas).length)
    scripts.forEach(({ json }) => {
      expect(() => JSON.parse(json)).not.toThrow()
    })
  })

  it('injects structured data scripts into the head exactly once', () => {
    injectStructuredData(document)
    injectStructuredData(document)

    const scripts = document.querySelectorAll("script[type='application/ld+json'][id^='schema-']")

    expect(scripts).toHaveLength(3)
    expect(document.getElementById('schema-organization')).toBeInTheDocument()
    expect(document.getElementById('schema-service')).toBeInTheDocument()
    expect(document.getElementById('schema-localBusiness')).toBeInTheDocument()
    expect(document.head).toMatchSnapshot()

    scripts.forEach((script) => {
      expect(() => JSON.parse(script.textContent ?? '')).not.toThrow()
    })
  })
})
