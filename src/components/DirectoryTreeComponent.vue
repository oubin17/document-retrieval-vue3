<template>
  <div v-if="isAdmin" class="dir-add">
    <el-button type="primary" @click="append()">添加目录</el-button>
  </div>


  <div class="grid-content">
    <el-tree class="dir-tree" :data="dataSource" node-key="id" default-expand-all :expand-on-click-node="false"
      :props="defaultProps" @node-contextmenu="handleNodeContextMenu">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span class="dir-name">{{ data.directoryName }} </span>
          <span class="dashed-fill"></span>
          <span class="dir-other">
            <span>{{ formatData(data.createTime) }}</span>
            <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
            <a v-if="data.directoryType === '1' && isAdmin" style="margin-left: 8px" @click="upload(node, data)">上传</a>
            <a v-if="data.directoryType === '1' && isAdmin" @click="append(data)"> 添加子目录 </a>
            <a v-if="isAdmin" style="margin-left: 8px; color: #E35F5F;" @click="remove(node, data)"> 删除 </a>
          </span>
        </span>
      </template>
    </el-tree>
  </div>


  <!-- 右键菜单 -->
  <div v-if="contextMenu.visible" :style="{
    position: 'fixed',
    top: contextMenu.top + 'px',
    left: contextMenu.left + 'px',
  }" class="context-menu">
    <el-button link class="download-button" @click="handlePreview()">预览</el-button>
    <el-button link class="download-button" @click="handleMenuClick()">下载</el-button>
  </div>

  <!-- Element Plus 预览弹窗 -->
  <el-dialog v-model="isModalVisible" :title="`文件预览 - ${fileName}`" width="80%" :before-close="closeModal">

    <!-- PDF 预览 -->
    <iframe v-if="fileType === 'pdf'" :src="fileUrl" class="preview-iframe"></iframe>

    <!-- DOCX 预览 -->
    <div v-if="fileType === 'docx'" ref="docxPreview" class="preview-docx"></div>

    <!-- DOC 预览 -->
    <!-- <iframe v-if="fileType === 'doc'"
      :src="`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`"
      class="preview-iframe"></iframe> -->
  </el-dialog>

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
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { directoryTree, directoryDelete, fileDelete, directoryAdd, fileUpload, fileDownload } from '@/api/index'
import { useSearchStore } from '../stores/searchStores'
import MomentFormatter from '@/utils/MomentFormatter'; // 引入日期格式化工具类
import { ElMessage } from 'element-plus'
import * as docx from 'docx-preview';

const defaultProps = {
  id: 'id',
  children: 'childDirectories',
  label: 'directoryName',
}

const searchStore = useSearchStore();

const dataSource = ref([])

// 监听 searchStore.dataSource 的变化
watch(
  () => searchStore.dataSource,
  (newValue) => {
    dataSource.value = newValue; // 更新 dataSource
  }
);

//判断是不是管理员，是的话，展示上传，删除按钮
const isAdmin = computed(() => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  try {
    return userInfo.roles.some(item => item.roleCode === 'ADMIN')
  } catch (error) {
    console.log('解析用户信息出错：', error)
    return false
  }

})

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
  parentId: '',
  orgId: ''
})

//添加按钮
const append = (data) => {
  if (data) {
    directoryCreate.parentId = data.id
  }
  dialogAppendVisable.value = true
}

//确认添加
const confirmAppend = (() => {
  directoryCreate.orgId = searchStore.orgId

  directoryAdd(directoryCreate).then((response) => {
    if (response.data.success) {
      ElMessage.success('添加成功')
    } else {
      ElMessage.error('添加失败')
    }
    directoryCreate.parentId = ''
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


// 右键菜单状态
const contextMenu = reactive({
  visible: false, // 是否显示菜单
  top: 0, // 菜单的 top 位置
  left: 0, // 菜单的 left 位置
  currentNode: null, // 当前右键点击的节点
})

//右击
const handleNodeContextMenu = (event, data, node, component) => {
  console.log(data)
  // 阻止默认的右键菜单
  event.preventDefault();

  // 显示自定义右键菜单
  if (data.directoryType == '2') {
    //文件
    contextMenu.visible = true;
    contextMenu.top = event.clientY;
    contextMenu.left = event.clientX;
    contextMenu.currentNode = node;
  }
  // 点击其他地方关闭菜单
  document.addEventListener('click', closeContextMenu);
}

/**
   * 关闭右键菜单
   */
const closeContextMenu = () => {
  contextMenu.visible = false;
  document.removeEventListener('click', closeContextMenu);
}


//预览弹窗
const isModalVisible = ref(false)
const fileUrl = ref(''); // 文件 URL
const fileType = ref(''); // 文件类型
const fileName = ref(''); //文件名称
const docxPreview = ref(null); // DOCX 预览容器

//文件预览
const handlePreview = async () => {
  const params = { "fileId": contextMenu.currentNode.data.fileId }
  const resp = await fileDownload(params)
  if (!resp || !resp.data) {
    throw new Error('文件下载失败')
  }
  const blob = new Blob([resp.data], { type: resp.headers['content-type'] });
  // 将文件内容转换为 Blob 对象
  fileUrl.value = URL.createObjectURL(blob);
  fileName.value = contextMenu.currentNode.data.directoryName


  if (fileName.value.includes('.pdf')) {
    fileType.value = 'pdf'
  } else if (fileName.value.includes('.docx')) {
    fileType.value = 'docx'
  }
  // else if (fileName.incluese('.doc')) {
  //   fileType.value = 'doc'
  // }
  else {
    throw new Error('不支持的文件类型');
  }
  isModalVisible.value = true
  // 等待弹窗完全打开
  await nextTick();

  if (fileType.value === 'docx') {
    docx.renderAsync(blob, docxPreview.value)
      .then(() => console.log('DOCX 渲染完成'))
      .catch((err) => {
        console.error('DOCX 渲染失败:', err);
        ElMessage.error('DOCX 文件渲染失败');
      });
  } else if (fileType.value === 'pdf') {

  } else if (fileType.value === 'doc') {

  } else {

  }

}

// 关闭弹窗
const closeModal = () => {
  isModalVisible.value = false;
  fileUrl.value = ''; // 清空文件 URL
  fileType.value = ''; // 清空文件类型
};

//文件下载
const handleMenuClick = () => {
  const params = { "fileId": contextMenu.currentNode.data.fileId }
  fileDownload(params).then((response) => {

    console.log(response.data)
    // 创建一个 Blob 对象
    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    // 创建一个链接元素
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);

    // 设置下载的文件名

    const fileName = response.headers['content-disposition']
      .split('filename*=UTF-8')[1]
      .replace(/['"]/g, ''); // 从响应头中提取文件名
    // const fileName = 'a.docx';
    link.download = decodeURIComponent(fileName);

    // 触发下载
    link.click();

    // 释放对象 URL
    window.URL.revokeObjectURL(link.href);
  })
}


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
    formData.append("orgId", searchStore.orgId)
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

const formatData = (date) => {
  return MomentFormatter.formatDateTime(date)
}

const getTree = async () => {
  //发送请求
  const params = { "orgId": searchStore.orgId }
  await directoryTree(params).then((response) => {
    dataSource.value = response.data.data
  })
}

</script>

<style lang="less" scoped>
.dir-add {
  padding: 0 0 10px 10%;
}

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
    //优化：屏幕高度
    min-height: 1000px;
  }
}

.dialog {
  text-align: center
}

.context-menu {
  background: #fff;
  border: 1px solid #ddd;
  // box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  padding: 2px;
  z-index: 1000;

  .download-button {
    font-size: 13px;
    font-weight: 100px;
    color: rgba(0, 136, 255, 1);
  }
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

    a,
    span {
      color: #8a8f8d
    }
  }

}

/* PDF/DOC 预览 */
.preview-iframe {
  width: 100%;
  height: 70vh;
  border: none;
}

/* DOCX 预览 */
.preview-docx {
  width: 100%;
  height: 70vh;
  overflow: auto;
}
</style>