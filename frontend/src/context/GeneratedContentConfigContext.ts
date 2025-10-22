import { createContext } from 'react'

import type { GeneratedContentConfig } from './generatedContentTypes'

export const GeneratedContentConfigContext = createContext<GeneratedContentConfig>({})
