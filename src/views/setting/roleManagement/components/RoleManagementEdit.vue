<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="角色描述" prop="remark">
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
  import { doCopy, doEdit, doSave } from '@/api/roleManagement'

  export default defineComponent({
    name: 'RoleManagementEdit',
    emits: ['fetch-data'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        treeRef: null,
        form: {
          name: '',
          remark: '',
          parentId: '0',
        },
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入角色名称' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      })

      const showEdit = (row, copy) => {
        if (!row) {
          state.title = '添加'
        } else {
          if (copy) {
            state.title = '拷贝'
          } else {
            state.title = '编辑'
          }
          state.form = JSON.parse(JSON.stringify(row))
          state.form.copyId = row.id.toString()
          state.form.id = 0
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
            } else if (state.title === '拷贝') {
              const { msg } = await doCopy({
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
