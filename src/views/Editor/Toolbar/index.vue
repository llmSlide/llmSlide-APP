<template>
  <div class="toolbar">
    <div 
      class="resize-handler"
      @mousedown="$event => resize($event)"
    ></div>
    <Tabs 
      :tabs="currentTabs" 
      :value="toolbarState" 
      card 
      @update:value="key => setToolbarState(key as ToolbarStates)"
    />
    <div class="content">
      <component :is="currentPanelComponent"></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { ToolbarStates } from '@/types/toolbar'

import ElementStylePanel from './ElementStylePanel/index.vue'
import ElementPositionPanel from './ElementPositionPanel.vue'
import ElementAnimationPanel from './ElementAnimationPanel.vue'
import SlideDesignPanel from './SlideDesignPanel/index.vue'
import SlideAnimationPanel from './SlideAnimationPanel.vue'
import MultiPositionPanel from './MultiPositionPanel.vue'
import MultiStylePanel from './MultiStylePanel.vue'
import SymbolPanel from './SymbolPanel.vue'
import Tabs from '@/components/Tabs.vue'
import ElementConversationPanel from './ElementConversationPanel.vue'

interface ElementTabs {
  label: string
  key: ToolbarStates
}

const mainStore = useMainStore()
const { activeElementIdList, activeElementList, activeGroupElementId, handleElement, toolbarState } = storeToRefs(mainStore)

const elementTabs = computed<ElementTabs[]>(() => {
  if (handleElement.value?.type === 'text') {
    return [
      { label: '樣式', key: ToolbarStates.EL_STYLE },
      { label: '符號', key: ToolbarStates.SYMBOL },
      { label: '位置', key: ToolbarStates.EL_POSITION },
      { label: '動畫', key: ToolbarStates.EL_ANIMATION },
      { label: '對話', key: ToolbarStates.EL_CONVERSATION },
    ]
  }
  return [
    { label: '樣式', key: ToolbarStates.EL_STYLE },
    { label: '位置', key: ToolbarStates.EL_POSITION },
    { label: '動畫', key: ToolbarStates.EL_ANIMATION },
    { label: '對話', key: ToolbarStates.EL_CONVERSATION },
  ]
})
const slideTabs = [
  { label: '設計', key: ToolbarStates.SLIDE_DESIGN },
  { label: '轉場', key: ToolbarStates.SLIDE_ANIMATION },
  { label: '動畫', key: ToolbarStates.EL_ANIMATION },
  { label: '對話', key: ToolbarStates.EL_CONVERSATION },
]
const multiSelectTabs = [
  { label: '樣式 (多選)', key: ToolbarStates.MULTI_STYLE },
  { label: '位置（多選）', key: ToolbarStates.MULTI_POSITION },
]

const setToolbarState = (value: ToolbarStates) => {
  mainStore.setToolbarState(value)
}

const currentTabs = computed(() => {
  if (!activeElementIdList.value.length) return slideTabs
  else if (activeElementIdList.value.length > 1) {
    if (!activeGroupElementId.value) return multiSelectTabs

    const activeGroupElement = activeElementList.value.find(item => item.id === activeGroupElementId.value)
    if (activeGroupElement) return elementTabs.value
    return multiSelectTabs
  }
  return elementTabs.value
})

watch(currentTabs, () => {
  const currentTabsValue: ToolbarStates[] = currentTabs.value.map(tab => tab.key)
  if (!currentTabsValue.includes(toolbarState.value)) {
    mainStore.setToolbarState(currentTabsValue[0])
  }
})

const currentPanelComponent = computed(() => {
  const panelMap = {
    [ToolbarStates.EL_STYLE]: ElementStylePanel,
    [ToolbarStates.EL_POSITION]: ElementPositionPanel,
    [ToolbarStates.EL_ANIMATION]: ElementAnimationPanel,
    [ToolbarStates.SLIDE_DESIGN]: SlideDesignPanel,
    [ToolbarStates.SLIDE_ANIMATION]: SlideAnimationPanel,
    [ToolbarStates.MULTI_STYLE]: MultiStylePanel,
    [ToolbarStates.MULTI_POSITION]: MultiPositionPanel,
    [ToolbarStates.SYMBOL]: SymbolPanel,
    [ToolbarStates.EL_CONVERSATION]: ElementConversationPanel,
  }
  return panelMap[toolbarState.value] || null
})
const props = defineProps<{
  width: number
}>()
const emit = defineEmits<{
  (event: 'update:width', payload: number): void
}>()
const resize = (e: MouseEvent) => {
  let isMouseDown = true
  const startPageX = e.pageX
  const originWidth = props.width

  document.onmousemove = e => {
    if (!isMouseDown) return

    const currentPageX = e.pageX
    const moveX = currentPageX - startPageX
    let newWidth = originWidth - moveX

    if (newWidth < 250) newWidth = 250
    if (newWidth > 720) newWidth = 720

    emit('update:width', newWidth)
  }

  document.onmouseup = () => {
    isMouseDown = false
    document.onmousemove = null
    document.onmouseup = null
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  position: relative;
  border-left: solid 1px $borderColor;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.content {
  padding: 12px;
  font-size: 13px;

  @include overflow-overlay();
}
.resize-handler {
  width: 7px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: -3px; // 假設拖拉條在左邊
  cursor: e-resize;
  z-index: 2;
}

</style>