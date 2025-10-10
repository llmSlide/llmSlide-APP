<template>
  <div class="media-input">
    <Tabs 
      :tabs="tabs" 
      v-model:value="type" 
      :tabsStyle="{ marginBottom: '15px' }" 
    />

    <template v-if="type === 'video'">
      <Input v-model:value="videoSrc" placeholder="請輸入影片網址，e.g. https://xxx.mp4"></Input>
      <div class="btns">
        <Button @click="emit('close')" style="margin-right: 10px;">取消</Button>
        <Button type="primary" @click="insertVideo()">確定</Button>
      </div>
    </template>

    <template v-if="type === 'audio'">
      <Input v-model:value="audioSrc" placeholder="請輸入音訊網址，e.g. https://xxx.mp3"></Input>
      <div class="btns">
        <Button @click="emit('close')" style="margin-right: 10px;">取消</Button>
        <Button type="primary" @click="insertAudio()">確定</Button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import message from '@/utils/message'
import Tabs from '@/components/Tabs.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'

type TypeKey = 'video' | 'audio'
interface TabItem {
  key: TypeKey
  label: string
}

const emit = defineEmits<{
  (event: 'insertVideo', payload: string): void
  (event: 'insertAudio', payload: string): void
  (event: 'close'): void
}>()

const type = ref<TypeKey>('video')

const videoSrc = ref('https://mazwai.com/videvo_files/video/free/2019-01/small_watermarked/181004_04_Dolphins-Whale_06_preview.webm')
const audioSrc = ref('https://freesound.org/data/previews/614/614107_11861866-lq.mp3')

const tabs: TabItem[] = [
  { key: 'video', label: '影片' },
  { key: 'audio', label: '音訊' },
]

const insertVideo = () => {
  if (!videoSrc.value) return message.error('請先輸入有效的影片網址')
  emit('insertVideo', videoSrc.value)
}

const insertAudio = () => {
  if (!audioSrc.value) return message.error('請先輸入有效的音訊網址')
  emit('insertAudio', audioSrc.value)
}
</script>

<style lang="scss" scoped>
.media-input {
  width: 480px;
}
.btns {
  margin-top: 10px;
  text-align: right;
}
</style>
