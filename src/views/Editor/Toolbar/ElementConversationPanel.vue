<template>
  <div class="dialog-panel" >
    <div class="chat-window" ref="chatWindow">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['chat-bubble', msg.role]"
      >
        <div v-if="msg.role === 'bot'" v-html="renderMarkdown(msg.text)"></div>
        <div v-else>{{ msg.text }}</div>
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
import { ref, nextTick, watch, onMounted } from 'vue'
import { useMainStore, useSlidesStore } from '@/store'
import { storeToRefs } from 'pinia'
import { marked } from 'marked'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElementId } = storeToRefs(useMainStore())

const messages = ref<Array<{ role: string; text: string }>>([])
const inputText = ref('')
const isBotReplying = ref(false)
const chatWindow = ref<HTMLElement | null>(null)

marked.setOptions({
  breaks: true,
  gfm: true
})

onMounted(() => {
  const savedMessages = mainStore.getGlobalConversation
  messages.value = Array.isArray(savedMessages) ? savedMessages : []
  nextTick(() => scrollToBottom())
})

watch(messages, (newMessages) => {
  mainStore.setGlobalConversation({ global: newMessages })
}, { deep: true })

function renderMarkdown(text: string): string {
  return marked(text) as string
}

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

  //updateSelectedElementText(botReply)
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
  height: calc(100vh - 105px);
  max-height: 100vh;
  overflow: hidden;
}

.chat-window {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #fff;
  font-size: 14px;
}

.chat-bubble {
  margin: 6px 0;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: fit-content;
  word-wrap: break-word;
  display: inline-block;
}

.chat-bubble.user {
  background-color: #d1eaff;
  text-align: right;
  margin-left: auto;
  display: block;
  width: fit-content;
  max-width: 80%;
}

.chat-bubble.bot {
  background-color: #eee;
  display: block;
  width: fit-content;
  max-width: 80%;
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

.chat-bubble.bot :deep(p) {
  margin: 0.5em 0;
}

.chat-bubble.bot :deep(code) {
  background-color: #f4f4f4;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

.chat-bubble.bot :deep(pre) {
  background-color: #f4f4f4;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}

.chat-bubble.bot :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.chat-bubble.bot :deep(ul),
.chat-bubble.bot :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.chat-bubble.bot :deep(blockquote) {
  border-left: 3px solid #ddd;
  padding-left: 10px;
  margin: 0.5em 0;
  color: #666;
}

.chat-bubble.bot :deep(a) {
  color: #3b82f6;
  text-decoration: none;
}

.chat-bubble.bot :deep(a:hover) {
  text-decoration: underline;
}

.chat-bubble.bot :deep(h1),
.chat-bubble.bot :deep(h2),
.chat-bubble.bot :deep(h3) {
  margin: 0.8em 0 0.4em 0;
  font-weight: bold;
}
</style>
