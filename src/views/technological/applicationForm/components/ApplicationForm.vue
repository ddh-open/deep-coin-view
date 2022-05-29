<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="审核内容" prop="comment">
        <el-input v-model="form.comment" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { checkTask } from '@/api/apply'

  export default defineComponent({
    name: 'ApplicationForm',
    emits: ['fetch-data'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')
      const state = reactive({
        formRef: null,
        form: {
          comment: '',
        },
        rules: {
          comment: [
            { required: true, trigger: 'blur', message: '请输入审核的commit' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      })

      const showEdit = async (row) => {
        state.title = '审核'
        state.form.procInstID = row.workFlowId
        state.dialogFormVisible = true
      }
      const close = () => {
        state['formRef'].resetFields()
        state.form = {
          comment: [],
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          if (valid) {
            const { msg } = await checkTask({
              ...state.form,
            })
            $baseMessage(msg, 'success', 'vab-hey-message-success')
            emit('fetch-data')
            close()
          }
        })
      }
      onMounted(async () => {})
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
