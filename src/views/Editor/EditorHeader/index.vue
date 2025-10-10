<template>
  <div class="editor-header">
    <div class="left">
      <Popover trigger="click" placement="bottom-start" v-model:value="mainMenuVisible">
        <template #content>
          <!--<PopoverMenuItem @click="openAIPPTDialog(); mainMenuVisible = false">AI 生成 PPT</PopoverMenuItem>-->
           <FileInput accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"  @change="files => {
            importPPTXFile(files)
            mainMenuVisible = false
          }">
          <!-- <PopoverMenuItem>匯入 PPTX 檔案（測試版）</PopoverMenuItem> -->
          </FileInput>
          <FileInput accept=".llmslide"  @change="files => {
            importSpecificFile(files)
            mainMenuVisible = false
          }">
            <PopoverMenuItem>匯入 llmSlide 檔案</PopoverMenuItem>
          </FileInput>
          <PopoverMenuItem @click="setDialogForExport('pptx')">匯出檔案</PopoverMenuItem>
          <PopoverMenuItem @click="resetSlides(); mainMenuVisible = false">重置投影片</PopoverMenuItem>
          <PopoverMenuItem @click="openMarkupPanel(); mainMenuVisible = false">投影片類型標註</PopoverMenuItem>
          <PopoverMenuItem @click="mainMenuVisible = false; hotkeyDrawerVisible = true">快捷操作</PopoverMenuItem>
        </template>
        <div class="menu-item"><IconHamburgerButton class="icon" /></div>
      </Popover>

      <div class="title">
        <Input 
          class="title-input" 
          ref="titleInputRef"
          v-model:value="titleValue" 
          @blur="handleUpdateTitle()" 
          v-if="editingTitle" 
        ></Input>
        <div 
          class="title-text"
          @click="startEditTitle()"
          :title="title"
          v-else
        >{{ title }}</div>
      </div>
    </div>

    <div class="content-center">
      <div class="label">選擇模型：</div>
        <Select
            class="model-select"
            v-model:value="model"
            @click="showModelList()"
            :options="modelOptions"
          />
      <div class="open-flolder-btn menu-item" v-tooltip="'開啟模型資料夾'" @click="openModelFolder">
        <IconFolderOpen class="icon" />
      </div>
      <div class="model-status" v-if="model">
        <div class="status-indicator" :class="{ 'status-loaded': isModelLoaded, 'status-error': !isModelLoaded }"></div>
        <span class="status-text">{{ isModelLoaded ? '已載入' : '未載入' }}</span>
      </div>
    </div>

    <div class="right">
      <div class="menu-item" v-tooltip="'AI生成PPT'" @click="openAIPPTDialog(); mainMenuVisible = false">
        <span class="text ai">AI</span>
      </div>
      <div class="group-menu-item">
        <div class="menu-item" v-tooltip="'投影片播放（F5）'" @click="enterScreening()">
          <IconPpt class="icon" />
        </div>
        <Popover trigger="click" center>
          <template #content>
            <PopoverMenuItem @click="enterScreeningFromStart()">從首張投影片開始</PopoverMenuItem>
            <PopoverMenuItem @click="enterScreening()">從目前投影片開始</PopoverMenuItem>
          </template>
          <div class="arrow-btn"><IconDown class="arrow" /></div>
        </Popover>
      </div>
    </div>

    <Drawer
      :width="320"
      v-model:visible="hotkeyDrawerVisible"
      placement="right"
    >
      <HotkeyDoc />
      <template v-slot:title>快捷操作</template>
    </Drawer>

    <FullscreenSpin :loading="exporting" tip="正在匯入…" />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useImport from '@/hooks/useImport'
import useSlideHandler from '@/hooks/useSlideHandler'
import type { DialogForExportTypes } from '@/types/export'

import HotkeyDoc from './HotkeyDoc.vue'
import FileInput from '@/components/FileInput.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import Drawer from '@/components/Drawer.vue'
import Input from '@/components/Input.vue'
import Popover from '@/components/Popover.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'
import Select from '@/components/Select.vue'
import { mode } from 'crypto-js'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { title } = storeToRefs(slidesStore)
const { enterScreening, enterScreeningFromStart } = useScreening()
const { importSpecificFile, importPPTXFile, exporting } = useImport()
const { resetSlides } = useSlideHandler()

const mainMenuVisible = ref(false)
const hotkeyDrawerVisible = ref(false)
const editingTitle = ref(false)
const titleInputRef = ref<InstanceType<typeof Input>>()
const titleValue = ref('')
type SelectOption = { label: string; value: string }
const modelOptions = ref<SelectOption[]>([])
const model = ref('')
const isModelLoaded = ref(false)

async function showModelList() {
  window.electronAPI.showModelList()
    try{
      const modelList = await window.electronAPI.showModelList();
      if (modelList && modelList.length > 0) {
        modelOptions.value = modelList
          .map(m => m.trim())
          .filter(m => m.length > 0)
          .map(m => ({ label: m.split(/[/\\\\]/).pop() || m, value: m }));
        console.log('Model options updated:', modelOptions.value)
      } else {
        console.log('No models found in the directory.')
        modelOptions.value = []
      }
  }catch(error){
    console.error('Error fetching model list:', error)
    modelOptions.value = []
  }
}

onMounted(async () => {
  await showModelList()
  console.log('Model options on mount:', modelOptions.value)
  model.value = modelOptions.value[0]?.value || ''
})

watch(model, async (newModel, oldModel) => {
  if (newModel && newModel !== oldModel) {
    await switchModel(newModel)
  }
})

const loadModelAndCheckStatus = async (modelPath: string) => {
  try {
    const modelStatus = await window.electronAPI.loadModel(modelPath)
    if (modelStatus) isModelLoaded.value = true
  } catch (error) {
    console.error('Failed to load model:', error)
    isModelLoaded.value = false
  }
}

const switchModel = async (newModel: string) => {
  await window.electronAPI.unloadModel()
  isModelLoaded.value = false
  await loadModelAndCheckStatus(newModel)
}

const startEditTitle = () => {
  titleValue.value = title.value
  editingTitle.value = true
  nextTick(() => titleInputRef.value?.focus())
}

const handleUpdateTitle = () => {
  slidesStore.setTitle(titleValue.value)
  editingTitle.value = false
}

const openModelFolder = async () => {
  window.electronAPI.openFolder('file://' + await window.electronAPI.getModelDirPath())
}

const setDialogForExport = (type: DialogForExportTypes) => {
  mainStore.setDialogForExport(type)
  mainMenuVisible.value = false
}

const openMarkupPanel = () => {
  mainStore.setMarkupPanelState(true)
}

const openAIPPTDialog = () => {
  mainStore.setAIPPTDialogState(true)
}
</script>

<style lang="scss" scoped>
.editor-header {
  background-color: #fff;
  user-select: none;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}
.left, .right {
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-item {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 0 10px;
  border-radius: $borderRadius;
  cursor: pointer;

  .icon {
    font-size: 18px;
    color: #666;
  }
  .text {
    width: 18px;
    text-align: center;
    font-size: 17px;
  }
  .ai {
    background: linear-gradient(270deg, #d897fd, #33bcfc);
    background-clip: text;
    color: transparent;
    font-weight: 700;
  }

  &:hover {
    background-color: #f1f1f1;
  }
}
.group-menu-item {
  height: 30px;
  display: flex;
  margin: 0 8px;
  padding: 0 2px;
  border-radius: $borderRadius;

  &:hover {
    background-color: #f1f1f1;
  }

  .menu-item {
    padding: 0 3px;
  }
  .arrow-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
.title {
  height: 30px;
  margin-left: 2px;
  font-size: 13px;

  .title-input {
    width: 200px;
    height: 100%;
    padding-left: 0;
    padding-right: 0;

    ::v-deep(input) {
      height: 28px;
      line-height: 28px;
    }
  }
  .title-text {
    min-width: 20px;
    max-width: 400px;
    line-height: 30px;
    padding: 0 6px;
    border-radius: $borderRadius;
    cursor: pointer;

    @include ellipsis-oneline();

    &:hover {
      background-color: #f1f1f1;
    }
  }
}
.github-link {
  display: inline-block;
  height: 30px;
}
.content-center {
  display: flex;
  align-items: center;

  .label {
    font-size: 13px;
    margin-right: 8px;
  }

  .model-select {
    margin-right: 5px;
  }

  .model-status {
    display: flex;
    align-items: center;
    margin-left: 8px;

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 5px;
      
      &.status-loaded {
        background-color: #52c41a;
        box-shadow: 0 0 4px rgba(82, 196, 26, 0.6);
      }
      
      &.status-error {
        background-color: #f5222d;
        box-shadow: 0 0 4px rgba(245, 34, 45, 0.6);
      }
    }

    .status-text {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>