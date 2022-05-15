<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="API组" prop="apiGroup">
        <el-input v-model.trim="form.apiGroup" />
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input v-model.trim="form.path" />
      </el-form-item>
      <el-form-item label="方法" prop="method">
        <el-input v-model.trim="form.method" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model.trim="form.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doEdit, doSave } from '@/api/apiManagement'

  export default defineComponent({
    name: 'ApiManagementEdit',
    emits: ['fetch-data'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        form: {},
        rules: {
          path: [{ required: true, trigger: 'blur', message: '请输入API路径' }],
          method: [
            { required: true, trigger: 'blur', message: '请输入API方法' },
          ],
          apiGroup: [
            { required: true, trigger: 'blur', message: '请输入API组' },
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
          roles: [],
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          if (valid) {
            if (state.title === '添加') {
              const { msg } = await doSave(state.form)
              $baseMessage(msg, 'success', 'vab-hey-message-success')
              emit('fetch-data')
            } else {
              const { msg } = await doEdit(state.form)
              $baseMessage(msg, 'success', 'vab-hey-message-success')
              emit('fetch-data')
            }
            close()
          }
        })
      }

      return {
        ...toRefs(state),
        showEdit,
        close,
        save,
      }
    },
  })
</script>
