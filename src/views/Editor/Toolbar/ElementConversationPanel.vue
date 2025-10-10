<template>
  <div class="dialog-panel" >
    <div class="chat-window" ref="chatWindow">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['chat-bubble', msg.role]"
      >
        {{ msg.text }}
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="inputText"
        @keyup.enter="sendMessage"
        placeholder="輸入訊息…"
      />
      <button @click="sendMessage">送出</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { useMainStore, useSlidesStore } from '@/store'
import { storeToRefs } from 'pinia'

const slidesStore = useSlidesStore()
const { handleElement, handleElementId } = storeToRefs(useMainStore())

const messages = ref([
  { role: '', text: '' }
])
const inputText = ref('')
const isBotReplying = ref(false)
const chatWindow = ref<HTMLElement | null>(null)

async function sendMessage() {
  if (!inputText.value.trim() || isBotReplying.value) return

  messages.value.push({ role: 'user', text: inputText.value })
  inputText.value = ''
  scrollToBottom()

  // 新增一個空的 bot 回覆
  messages.value.push({ role: 'bot', text: '' })
  isBotReplying.value = true

  let botReply = ''
  await BotResponseStream(messages.value[messages.value.length - 2].text, (chunk: string) => {
    botReply += chunk
    messages.value[messages.value.length - 1].text = botReply
    scrollToBottom()
  });

  updateSelectedElementText(botReply)
  isBotReplying.value = false
}

function scrollToBottom() {
  nextTick(() => {
    if (chatWindow.value) {
      chatWindow.value.scrollTop = chatWindow.value.scrollHeight
    }
  })
}

async function BotResponseStream(userMessage: string, onChunk: (chunk: string) => void) {
  window.electronAPI.onChatStreamChunk((chunk: string) => {
    if (chunk === '[END]') return;
    onChunk(chunk);
  });
  await window.electronAPI.chatStream(userMessage);
}

function updateSelectedElementText(newText: string) {
  const currentSlide = slidesStore.slides[slidesStore.slideIndex]
  const selectedElementId = handleElementId.value
  const selectedElement = currentSlide.elements.find(el => el.id === selectedElementId)
  if (selectedElement && selectedElement.type === 'text') {
    slidesStore.updateElement({
      id: selectedElement.id,
      props: { content: newText }
    })
  }
}
</script>

<style scoped>
.dialog-panel {
  display: flex;
  flex-direction: column;
  height: 85vh;
  overflow: hidden;
}

.chat-window {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #f9f9f9;
  font-size: 14px;
}

.chat-bubble {
  margin: 6px 0;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
}

.chat-bubble.user {
  align-self: flex-end;
  background-color: #d1eaff;
  text-align: right;
  margin-left: auto; 
}

.chat-bubble.bot {
  align-self: flex-start;
  background-color: #eee;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
  background: #fff;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.chat-input button {
  margin-left: 8px;
  padding: 8px 12px;
  border: none;
  background-color: #3b82f6;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
