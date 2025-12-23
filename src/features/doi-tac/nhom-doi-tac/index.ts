// Re-export hooks, components, actions, config, and types for convenience
// This file allows importing non-component exports from the module
export * from './hooks'
export * from './config'
export * from './components'
export * from './actions'
export * from './types'

// Export the main module component
export { NhomDoiTacModule, default } from './index.tsx'

