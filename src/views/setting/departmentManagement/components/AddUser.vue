<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="关联用户" prop="userIds">
        <el-select
          v-model="form.userIds"
          collapse-tags
          collapse-tags-tooltip
          filterable
          multiple
          placeholder="请选择用户"
        >
          <el-option
            v-for="item in data"
            :key="item.value"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { getList } from '@/api/userManagement'
  import { doAddUser } from '@/api/departmentManagement'

  export default defineComponent({
    name: 'AddUser',
    emits: ['fetch-data'],
    setup(props, { emit }) {
      const $baseMessage = inject('$baseMessage')

      const state = reactive({
        formRef: null,
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        form: {
          userIds: '',
          groupId: '',
        },
        rules: {
          userIds: [{ required: true, trigger: 'blur', message: '请选择用户' }],
        },
        title: '',
        dialogFormVisible: false,
      })

      const fetchData = async () => {
        const {
          data: { list },
        } = await getList({})
        state.data = list
      }
      const handleNodeClick = (node) => {
        state.form.parentName = node.name
        state.form.parentId = node.id
      }
      const showEdit = (row) => {
        state.form.groupId = row.id
        state.title = '关联用户'
        state.dialogFormVisible = true
      }
      const close = () => {
        state['formRef'].resetFields()
        state.form = {
          parentName: '',
          parentId: '',
        }
        state.dialogFormVisible = false
      }
      const save = () => {
        state['formRef'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doAddUser(state.form)
            $baseMessage(msg, 'success', 'vab-hey-message-success')
            emit('fetch-data')
            close()
          }
        })
      }

      fetchData()

      return {
        ...toRefs(state),
        handleNodeClick,
        showEdit,
        close,
        save,
      }
    },
  })
</script>
