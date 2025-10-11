<template>
  <div class="pptist-editor">
    <EditorHeader class="layout-header" />
    <div class="layout-content">
      <Thumbnails class="layout-content-left" 
        v-model:width="thumbnailsWidth" 
        :style="{ width: `${thumbnailsWidth}px` }"
      />
      <div class="layout-content-center" :style="{ width: `calc(100% - ${thumbnailsWidth + toolbarWidth}px)` }">
        <CanvasTool class="center-top" />
        <Canvas class="center-body" :style="{ height: `calc(100% - ${remarkHeight + 40}px)` }" />
        <Remark
          class="center-bottom" 
          v-model:height="remarkHeight" 
          :style="{ height: `${remarkHeight}px` }"
        />
      </div>
      <Toolbar 
        class="layout-content-right" 
        v-model:width="toolbarWidth"
        :style="{ width: `${toolbarWidth}px`, minWidth: '300px'}"
      />
    </div>
  </div>

  <SelectPanel v-if="showSelectPanel" />
  <SearchPanel v-if="showSearchPanel" />
  <NotesPanel v-if="showNotesPanel" />
  <MarkupPanel v-if="showMarkupPanel" />

  <Modal
    :visible="!!dialogForExport" 
    :width="680"
    @closed="closeExportDialog()"
  >
    <ExportDialog />
  </Modal>

  <Modal
    :visible="showAIPPTDialog" 
    :width="680"
    :closeOnClickMask="false"
    :closeOnEsc="false"
    closeButton
    @closed="closeAIPPTDialog()"
  >
    <AIPPTDialog />
  </Modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import useGlobalHotkey from '@/hooks/useGlobalHotkey'
import usePasteEvent from '@/hooks/usePasteEvent'

import EditorHeader from './EditorHeader/index.vue'
import Canvas from './Canvas/index.vue'
import CanvasTool from './CanvasTool/index.vue'
import Thumbnails from './Thumbnails/index.vue'
import Toolbar from './Toolbar/index.vue'
import Remark from './Remark/index.vue'
import ExportDialog from './ExportDialog/index.vue'
import SelectPanel from './SelectPanel.vue'
import SearchPanel from './SearchPanel.vue'
import NotesPanel from './NotesPanel.vue'
import MarkupPanel from './MarkupPanel.vue'
import AIPPTDialog from './AIPPTDialog.vue'
import Modal from '@/components/Modal.vue'

const mainStore = useMainStore()
const { dialogForExport, showSelectPanel, showSearchPanel, showNotesPanel, showMarkupPanel, showAIPPTDialog } = storeToRefs(mainStore)
const closeExportDialog = () => mainStore.setDialogForExport('')
const closeAIPPTDialog = () => mainStore.setAIPPTDialogState(false)

const remarkHeight = ref(40)
const toolbarWidth = ref(300)
const thumbnailsWidth = ref(160)

useGlobalHotkey()
usePasteEvent()
</script>

<style lang="scss" scoped>
.pptist-editor {
  height: 100%;
}
.layout-header {
  height: 40px;
}
.layout-content {
  height: calc(100% - 40px);
  display: flex;
}




</style>