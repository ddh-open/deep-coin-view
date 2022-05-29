<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="服务名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Git仓库" prop="gitProject">
        <el-input v-model="form.gitProject" />
      </el-form-item>
      <el-form-item label="服务描述" prop="remark">
        <el-input v-model="form.remark" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doEdit, doSave } from '@/api/application'

  export default defineComponent({
    name: 'ServiceManagementEdit',
    emits: ['fetch-data'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        treeRef: null,
        form: {
          name: '',
          remark: '',
          gitProject: '',
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入角色名称' },
          ],
          gitProject: [
            { required: true, trigger: 'blur', message: '请输入git仓库' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      })

      const showEdit = (row) => {
        if (!row) {
          state.title = '添加'
        } else {
          state.title = '编辑'
          state.form = JSON.parse(JSON.stringify(row))
        }
        state.dialogFormVisible = true
      }
      const close = () => {
        state['formRef'].resetFields()
        state.form = {
          btnRolesCheckedList: [],
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          if (valid) {
            if (state.title === '添加') {
              const { msg } = await doSave({
                ...state.form,
              })
              $baseMessage(msg, 'success', 'vab-hey-message-success')
            } else {
              const { msg } = await doEdit({
                ...state.form,
              })
              $baseMessage(msg, 'success', 'vab-hey-message-success')
            }
            emit('fetch-data')
            close()
          }
        })
      }
      onMounted(() => {})
      return {
        ...toRefs(state),
        showEdit,
        close,
        save,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .vab-tree-border {
    width: 100%;
    height: 250px;
    padding: $base-padding;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: $base-border-radius;
  }
</style>
