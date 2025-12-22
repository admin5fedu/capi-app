import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getModule, shouldSeparateModule } from '../registry'
import { GenericModuleTabView } from './generic-module-tab-view'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { ModuleTabConfig } from '../types'

interface GenericModuleRouterProps {
  moduleId: string
  customRenderer?: (config: any) => React.ReactNode
}

/**
 * Generic Module Router
 * Tự động route và render module dựa trên config đã đăng ký
 */
export function GenericModuleRouter({
  moduleId,
  customRenderer,
}: GenericModuleRouterProps) {
  const config = getModule(moduleId)
  const location = useLocation()

  if (!config) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">Module "{moduleId}" not found in registry</div>
      </div>
    )
  }

  // Nếu có custom renderer, dùng nó
  if (customRenderer) {
    return <>{customRenderer(config)}</>
  }

  // Single module - không có tabs
  if (config.type === 'single') {
    // TODO: Render single module view
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Single module view - To be implemented</div>
      </div>
    )
  }

  // Multi-tab module
  if (config.type === 'multi_tab' && config.tabs) {
    // Kiểm tra xem có cần tách code không
    const needsSeparation = shouldSeparateModule(config)

    if (needsSeparation) {
      // Module cần tách code → render tabs với components riêng
      return <MultiTabSeparatedView config={config} />
    } else {
      // Module không cần tách code → render tabs dùng chung components
      return <MultiTabUnifiedView config={config} />
    }
  }

  return null
}

/**
 * Multi-tab view khi cần tách code (separate components)
 */
function MultiTabSeparatedView({ config }: { config: any }) {
  // Detect active tab từ URL hoặc default
  const location = useLocation()
  const defaultTabId = config.tabs?.[0]?.id
  const activeTabFromUrl = config.tabs?.find((tab: ModuleTabConfig) =>
    location.pathname.includes(tab.path)
  )
  const [activeTab, setActiveTab] = useState(activeTabFromUrl?.id || defaultTabId)
  const activeTabConfig = config.tabs?.find((t: ModuleTabConfig) => t.id === activeTab)

  if (!activeTabConfig) return null

  // Nếu có custom component, dùng nó
  if (activeTabConfig.components?.ListView) {
    const ListView = activeTabConfig.components.ListView
    return (
      <>
        <TabNavigation tabs={config.tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <ListView />
      </>
    )
  }

  // Dùng generic với config
  return (
    <>
      <TabNavigation tabs={config.tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <GenericModuleTabView tabConfig={activeTabConfig} />
    </>
  )
}

/**
 * Multi-tab view khi không cần tách code (unified components)
 */
function MultiTabUnifiedView({ config }: { config: any }) {
  const defaultTabId = config.tabs?.[0]?.id
  const [activeTab, setActiveTab] = useState(defaultTabId)
  const activeTabConfig = config.tabs?.find((t: ModuleTabConfig) => t.id === activeTab)

  if (!activeTabConfig || !config.tabs) return null

  // Dùng generic component với dataSource filter
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-xs grid-cols-2 mb-4">
        {config.tabs.map((tab: ModuleTabConfig) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {config.tabs.map((tab: ModuleTabConfig) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-0 flex-1 min-h-0">
          {activeTab === tab.id && (
            <GenericModuleTabView tabConfig={tab} />
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}

/**
 * Tab Navigation Component - Shadcn UI Style
 */
function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: ModuleTabConfig[]
  activeTab: string
  onTabChange: (tabId: string) => void
}) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full max-w-xs grid-cols-2 mb-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

