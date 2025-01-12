<template>
  <div class="grid-content">
    <el-tree class="dir-tree" :data="dataSource" node-key="id" default-expand-all :expand-on-click-node="false"
      :props="defaultProps">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span class="dir-name">{{ data.directoryName }} </span>
          <span class="dashed-fill"></span>
          <span class="dir-other">
            <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
            <a v-if="data.directoryType === '1'" style="margin-left: 8px" @click="upload(node, data)"> 上传</a>
            <a v-if="data.directoryType === '1'" @click="append(data)"> 添加子目录 </a>
            <a style="margin-left: 8px; color: #E35F5F;" @click="remove(node, data)"> 删除 </a>
          </span>
        </span>
      </template>
    </el-tree>
  </div>

  <el-dialog v-model="dialogDeleteVisable" title="提醒" width="500" center>
    <div class="dialog">
      <span v-if="isFile">
        是否删除文件{{ dialogDirectory.directoryName }} ？
      </span>
      <span v-else>
        目录删除后会将子目录一并删除，请确认是否执行删除操作！
      </span>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogDeleteVisable = false">取消</el-button>
        <el-button type="primary" @click="confirmRemove()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>


  <el-dialog v-model="dialogAppendVisable" title="请输入目录名称" width="500" center>
    <div class="dialog">
      <el-form label-width="auto" :model="directoryCreate" style="max-width: 600px">
        <el-form-item label="目录名称">
          <el-input v-model="directoryCreate.directoryName" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogAppendVisable = false">取消</el-button>
        <el-button type="primary" @click="confirmAppend()">
          确认
        </el-button>
      </div>
    </template>

  </el-dialog>

</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { directoryTree, directoryDelete, fileDelete, directoryAdd, fileUpload } from '../api/index'
import { useSearchStore } from '../stores/searchStores'
import { ElMessage } from 'element-plus'
import { defineProps } from 'vue';

const defaultProps = {
  id: 'id',
  children: 'childDirectories',
  label: 'directoryName',
}
const props = defineProps({
  message: {
    type: Array,
    default: () => [], // 默认值为空数组
  }
})

const searchStore = useSearchStore();

const dataSource = ref([])
// 监听 props.message 的变化
//如果父组件传递的 message 是异步获取的，可能会导致子组件在初始化时 props.message 为空。可以通过 watch 监听 props.message 的变化。
watch(
  () => props.message,
  (newValue) => {
    dataSource.value = newValue;
  },
  { immediate: true } // 立即执行一次
);

// 监听 searchStore.dataSource 的变化
watch(
  () => searchStore.dataSource,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      dataSource.value = newValue; // 更新 dataSource
    }
  }
);

//删除弹窗的显示隐藏
const dialogDeleteVisable = ref(false)
const dialogAppendVisable = ref(false)

const dialogDirectory = reactive({})
//computed 返回的是一个 只读的响应式引用，不能直接赋值给 ref。
const isFile = computed(() => {
  return dialogDirectory.directoryType === '2'
})

const directoryCreate = reactive({
  directoryName: '',
  parentId: ''
})

//添加按钮
const append = (data) => {
  directoryCreate.parentId = data.id
  dialogAppendVisable.value = true
}

//确认添加
const confirmAppend = (() => {
  directoryAdd(directoryCreate).then((response) => {
    if (response.data.success) {
      ElMessage.success('添加成功')
    } else {
      ElMessage.error('添加失败')
    }
    directoryCreate.directoryName = null
    dialogAppendVisable.value = false
    getTree()
  })
})

//删除按钮
const remove = (node, data) => {
  Object.assign(dialogDirectory, data)
  dialogDeleteVisable.value = true
}

//弹窗确认删除
const confirmRemove = () => {
  const params = {}
  if (dialogDirectory.directoryType === '1') {
    //删除文件夹
    params.dirId = dialogDirectory.id
    directoryDelete(params).then((response) => {
      getTree()
    })
  } else if (dialogDirectory.directoryType === '2') {
    //删除文件
    params.docId = dialogDirectory.fileId
    fileDelete(params).then((response) => {
      getTree()
    })
  }
  dialogDeleteVisable.value = false
  ElMessage.success('删除成功')
}

const fileInput = ref() // 引用文件输入框

const fileCreate = reactive({
  id: '',
  selectedFile: '' // 存储选择的文件
})

//上传文件
const upload = (node, data) => {
  fileInput.value.click();
  fileCreate.id = data.id
}
// 处理文件选择
const handleFileChange = (event) => {
  fileCreate.selectedFile = event.target.files[0]; // 获取选择的文件
  if (fileCreate.selectedFile) {
    const formData = new FormData()
    formData.append("file", fileCreate.selectedFile)
    formData.append("dirId", fileCreate.id)
    fileUpload(formData).then((response) => {
      if (response.data.data) {
        //上传成功
        ElMessage.success("文件上传成功")
        getTree()
      } else {
        ElMessage.error("文件上传失败！")
      }
    })
  }
};

const getTree = async () => {
  //发送请求
  await directoryTree().then((response) => {
    dataSource.value = response.data.data
    console.log(response.data)
  })
}

onMounted(() => {
  getTree()
})

</script>

<style lang="less" scoped>
.grid-content {
  display: flex;
  /* 启用 Flexbox 布局 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  min-height: 36px;

  .dir-tree {
    width: 1000px;
    max-width: 100%;
  }
}

.dialog {
  text-align: center
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .dir-name {
    font-size: 15px;
    font-weight: 400;
  }

  .dashed-fill {
    display: flex;
    width: 100%;
    /* 启用 Flexbox 布局 */
    /* 设置 span 的宽度 */
    overflow: hidden;
  }

  /* 防止内容溢出 */
  .dashed-fill::after {
    content: '';
    /* 伪元素内容 */
    flex-grow: 1;
    /* 占据剩余空间 */
    border-bottom: 1px dashed #ccc;
    /* 使用虚线填充 */
    margin-left: 30px;
    /* 内容和虚线之间的间距 */
  }

  .dir-other {
    font-size: 13px;

    a {
      color: #8a8f8d
    }
  }

}
</style>